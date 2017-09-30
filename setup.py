#!/usr/bin/env python

from distutils.core import setup

LONG_DESCRIPTION = \
'''
Create a web-based visualisation for a Common Workflow Language pipeline.
'''


setup(
    name='cwl_explorer',
    version='0.1.0.0',
    author='Bernie Pope',
    author_email='bjpope@unimelb.edu.au',
    packages=['cwl_explorer'],
    package_dir={'cwl_explorer': 'cwl_explorer'},
    package_data={'cwl_explorer': ['assets/*']},
    entry_points={
        'console_scripts': ['cwl_explorer = cwl_explorer.cwl_explorer:main']
    },
    url='https://github.com/bjpop/cwl_explorer',
    license='LICENSE',
    description=('Common Workflow Language visualisation'),
    long_description=(LONG_DESCRIPTION),
    install_requires=["cwltool==1.0.20170928192020"],
)
