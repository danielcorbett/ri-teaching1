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
from flask import Flask, render_template, url_for
from sklearn.datasets import load_breast_cancer

app = Flask(__name__)

#---------------------------------------------------------------------------------
# FUNCTION:     home()
# INPUT:        void
# OUTPUT:       Template
# DESCRIPTION:  Load the cancer data into a dataframe and return the
#               dataframe as a HTML table
#---------------------------------------------------------------------------------
@app.route('/')
def home():
    cancer = load_breast_cancer()
    data = np.c_[cancer.data, cancer.target]
    columns = np.append(cancer.feature_names, ["target"])
    df = pd.DataFrame(data, columns=columns)
    mooc_tab = df.head(10)
    return render_template('random_forest_one.html', tables=[mooc_tab.to_html(classes='data_tab', header="true")])

#---------------------------------------------------------------------------------
# FUNCTION:     showRF()
# INPUT:        void
# OUTPUT:       Template
# DESCRIPTION:  Show the second page with the pre-computed RF results
#
#---------------------------------------------------------------------------------
@app.route('/show_random_forest', methods=['POST'])
def showRF():
    return render_template('random_forest_two.html')

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