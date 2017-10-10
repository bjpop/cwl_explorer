# Overview 

cwl-explorer is a web-based visualisation tool for [Common Workflow Language (CWL)](http://www.commonwl.org/) workflow specifications.

A command line program, called `cwl_explorer`, reads in a CWL desscription and generates a web-based visualisation as output.

cwl-explorer calls upon another program called [cwltool](https://github.com/common-workflow-language/cwltool) to validate the input CWL file, and to pack multi-file workflows into a single file.

# License

cwl-explorer is released as open source software under the terms of MIT License.

# Installation and usage 

In the examples below, `$` indicates the command line prompt. `SRC` is supposed to be the path to the directory where you put the cwl-explorer code. VENV is supposed to be the path to the directory where you put a [Python virtual environment]() to install cwl-explorer.

Get a copy of the source code by cloning this repository:
```
$ cd $SRC
$ git clone https://github.com/bjpop/cwl_explorer 
```

Choose how to install below based on the version of Python you are using.

Install into a virtual environment for Python 3.x:
```
$ cd $VENV
$ python3 -m venv cwl_explorer_env
$ source cwl_explorer_env/bin/activate
$ pip install $SRC/cwl_explorer
```

Install into a virtual environment for Python 2.7:
```
$ cd $VENV
$ virtualenv cwl_explorer_env
$ source cwl_explorer_env/bin/activate
$ pip install $SRC/cwl_explorer
```

## Usage 

An example. Suppose that the top level CWL file for your workflow is stored in the file called `workflows/example.cwl`
```
$ cwl_explorer --log log.txt --outdir vis workflows/example.cwl 
```
The above command will create an output directory called `vis` and populate it with the necessary files for the visualisation. If the specified `outdir` already exists it will not try to create it again, but instead it will simply try to populate it with the necessary files.

You can view the visualisation by opening the file `vis/index.html` in a web browser. On many systems this can be done with the following command:

```
open vis/index.html
```

cwl-explorer can display usage information on the command line via the `-h` or `--help` argument:

```
$ cwl_explorer -h 
usage: cwl_explorer [-h] [--version] [--outdir OUTPUT_DIR] [--log LOG_FILE]
                    CWL_FILE

Produce a visualisation for an input CWL pipeline description

positional arguments:
  CWL_FILE             Input CWL file path

optional arguments:
  -h, --help           show this help message and exit
  --version            show program's version number and exit
  --outdir OUTPUT_DIR  optional directory to write output, defaults to a
                       directory based on the name of the input CWL file
  --log LOG_FILE       record program progress in LOG_FILE

```


## Logging

If the ``--log FILE`` command line argument is specified, cwl-explorer will output a log file containing information about program progress. The log file includes the command line used to execute the program, and some information about progress. Output messages from cwltool are written to the log file as well, which can be useful for debugging input CWL validation errors.

# Exit status values

Biotool returns the following exit status values:

* 0: The program completed successfully.
* 1: File I/O error. 
* 2: A command line error occurred. 
* 3: An error occurred when trying to pack multi-file CWL files into one file, using cwltool. Possibly a CWL validation error. 
* 4: Could not properly parse the filepath for the input CWL file (perhaps the filepath is invalid).

# Authors

* Bernie Pope 
* Mailie Gall 
* Natalie Thorne 
