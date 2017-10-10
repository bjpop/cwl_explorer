# Overview 

cwl-explorer is a web-based visualisation tool for [Common Workflow Language (CWL)](http://www.commonwl.org/) workflow specifications.

A command line program, called `cwl_explorer`, reads in a CWL desscription and generates a web-based visualisation as output.

# License

cwl-explorer is released as open source software under the terms of MIT License.

# Installation and usage 

In the examples below, `$` indicates the command line prompt. `SRC` is supposed to be the path to the directory where you put the cwl-explorer code. VENV is supposed to be the path to the directory where you put a [Python virtual environment]() to install cwl-explorer.

Python 2.7:
```
$ cd $SRC
$ git clone https://github.com/bjpop/cwl_explorer 
$ cd $VENV
$ virtualenv cwl_explorer_env
$ source cwl_explorer_env/bin/activate
$ pip install $SRC 
```

## Help message

cwl-explorer can display usage information on the command line via the `-h` or `--help` argument:

```
$ cwl_explorer -h 

```


## Logging

If the ``--log FILE`` command line argument is specified, cwl-explorer will output a log file containing information about program progress. The log file includes the command line used to execute the program, and 

```
```

# Exit status values

Biotool returns the following exit status values:

* 0: The program completed successfully.
* 1: File I/O error. 
* 2: A command line error occurred. 


# Authors

* Bernie Pope 
* Mailie Gall 
* Natalie Thorne 
