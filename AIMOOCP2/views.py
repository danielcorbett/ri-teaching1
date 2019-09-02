# -*- coding: utf-8 -*-
"""
NAME:          views.py
AUTHOR:        Alan Davies
EMAIL:         alan.davies-2@manchester.ac.uk
PROFILE:       https://www.research.manchester.ac.uk/portal/alan.davies-2.html | https://alandavies.netlify.com/
DATE:          19/07/2019
INSTITUTION:   University of Manchester, School of Health Sciences
DESCRIPTION:   Flask route page. Maps HTML pages to Python functions.
"""

import os, sys
import pandas as pd
import numpy as np
from flask import Flask, render_template, url_for, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn import metrics
from sklearn.metrics import confusion_matrix
from sklearn.metrics import precision_recall_fscore_support as score
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)

#---------------------------------------------------------------------------------
# FUNCTION:     home()
# INPUT:        void
# OUTPUT:       Template
# DESCRIPTION:  Load the cancer data into a dataframe and return the
#               columns (features)
#---------------------------------------------------------------------------------
@app.route('/')
def home():
    cancer = load_breast_cancer()
    data = np.c_[cancer.data, cancer.target]
    columns = np.append(cancer.feature_names, ["target"])
    df = pd.DataFrame(data, columns=columns)
    return render_template('random_forest_three.html', features=df.columns.values)

#---------------------------------------------------------------------------------
# FUNCTION:     rerunForest()
# INPUT:        void
# OUTPUT:       JSON
# DESCRIPTION:  Returns RF results with parameters determined by the
#               user from the front end
#---------------------------------------------------------------------------------
@app.route('/run_again', methods=['POST', 'GET'])
def rerunForest():
    cancer = load_breast_cancer()
    data = np.c_[cancer.data, cancer.target]
    columns = np.append(cancer.feature_names, ["target"])
    df = pd.DataFrame(data, columns=columns)

    if request.method == 'POST':
        test_split = int(request.json['new_test_split']) / 100
        num_trees = int(request.json['new_num_trees'])
        features = list(request.json['selected_features'])
        df = df[df.columns.intersection(features)]
    else:
        test_split = 0.25
        num_trees = 200

    X = df.iloc[:, 0:-1].values
    y = df.iloc[:, -1].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_split, random_state=0)

    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)

    rf = RandomForestClassifier(n_estimators=num_trees, random_state=0)
    rf.fit(X_train, y_train)
    y_pred = rf.predict(X_test)

    precision, recall, fscore, support = score(y_test, y_pred, average='macro')
    conf_mat = confusion_matrix(y_test, y_pred)
    results = {'accuracy': metrics.accuracy_score(y_test, y_pred), 'precision':precision,
               'recall':recall, 'fscore':fscore, 'support':support, 'conf_mat':conf_mat.tolist()}

    return jsonify(results)

#---------------------------------------------------------------------------------
# FUNCTION:     override_url_for()
# INPUT:        void
# OUTPUT:       dict
# DESCRIPTION:  Returns URL date function
#
#---------------------------------------------------------------------------------
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

#---------------------------------------------------------------------------------
# FUNCTION:     dated_url_for()
# INPUT:        **kwargs
# OUTPUT:       URL
# DESCRIPTION:  Returns URL dated to prevent caching issue
#
#---------------------------------------------------------------------------------
def dated_url_for(endpoint, **values):
    if endpoint=='static':
        filename=values.get('filename', None)

        if filename:
            file_path=os.path.join(app.root_path, endpoint, filename)
            values['q']=int(os.stat(file_path).st_mtime)
            print(file_path, file=sys.stderr)

    return url_for(endpoint, **values)

if __name__ == '__main__':
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(debug=True)