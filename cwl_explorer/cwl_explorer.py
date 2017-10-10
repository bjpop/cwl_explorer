'''
Module      : Main 
Description : The main entry point for the program.
Copyright   : (c) Bernie Pope, 2017 
License     : MIT 
Maintainer  : bjpope@unimelb.edu.au
Portability : POSIX

This program reads in a Common Workflow Language pipeline description
and generates a visualisation as output.
'''

from __future__ import print_function
from argparse import ArgumentParser
import sys
import logging
import pkg_resources
import subprocess
import os
import shutil


EXIT_FILE_IO_ERROR = 1
EXIT_COMMAND_LINE_ERROR = 2
EXIT_CWL_PACK_ERROR = 3
EXIT_CWL_PATH_ERROR = 4
DEFAULT_VERBOSE = False
PROGRAM_NAME = "cwl_explorer"
ASSETS_DIR_NAME = "assets"


try:
    PROGRAM_VERSION = pkg_resources.require(PROGRAM_NAME)[0].version
except pkg_resources.DistributionNotFound:
    PROGRAM_VERSION = "undefined_version"


def exit_with_error(message, exit_status):
    '''Print an error message to stderr, prefixed by the program name and 'ERROR'.
    Then exit program with supplied exit status.

    Arguments:
        message: an error message as a string.
        exit_status: a positive integer representing the exit status of the
            program.
    '''
    logging.error(message)
    print("{} ERROR: {}, exiting".format(PROGRAM_NAME, message), file=sys.stderr)
    sys.exit(exit_status)


def parse_args():
    '''Parse command line arguments.
    Returns Options object with command line argument values as attributes.
    Will exit the program on a command line error.
    '''
    parser = ArgumentParser(description='Produce a visualisation for an input CWL pipeline description')
    parser.add_argument('--version',
        action='version',
        version='%(prog)s ' + PROGRAM_VERSION)
    parser.add_argument('--outdir',
        metavar='OUTPUT_DIR',
        type=str,
        required=False,
        help='optional directory to write output, defaults to a directory based on the name of the input CWL file')
    parser.add_argument('--log',
        metavar='LOG_FILE',
        type=str,
        help='record program progress in LOG_FILE')
    parser.add_argument('cwl_filepath',
        metavar='CWL_FILE',
        type=str,
        help='Input CWL file path')
    return parser.parse_args()


def init_logging(log_filename):
    '''If the log_filename is defined, then
    initialise the logging facility, and write log statement
    indicating the program has started, and also write out the
    command line from sys.argv

    Arguments:
        log_filename: either None, if logging is not required, or the
            string name of the log file to write to
    Result:
        None
    '''
    if log_filename is not None:
        logging.basicConfig(filename=log_filename,
            level=logging.DEBUG,
            filemode='w',
            format='%(asctime)s %(levelname)s - %(message)s',
            datefmt='%m-%d-%Y %H:%M:%S')
        logging.info('program started')
        logging.info('command line: {0}'.format(' '.join(sys.argv)))



def pack_cwl(output_dir, cwl_filepath):
    output_packed_file_path = os.path.join(output_dir, "workflow.js")
    command = "cwltool --pack {cwl_file}".format(cwl_file=cwl_filepath)
    process = subprocess.Popen(command, stderr=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
    stdout, stderr = process.communicate() 
    # Assume that the stdout and stderr streams are UTF8 compatible
    if stdout is not None and sys.version_info[0] > 2:
        stdout = stdout.decode('utf8')
    if stderr is not None and sys.version_info[0] > 2:
        stderr = stderr.decode('utf8')
    if stderr is not None and len(stderr) > 0:
        logging.info("cwltool stderr: {}".format(stderr.strip()))
    if process.returncode != 0:
        exit_with_error("failed to pack input CWL file", EXIT_CWL_PACK_ERROR)
    elif len(stdout) > 0:
        with open(output_packed_file_path, "w") as output_file:
            output_workflow_contents = '"use strict";\n const input_workflow =\n' + stdout
            output_file.write(output_workflow_contents)
    else:
        exit_with_error("packed CWL file is empty", EXIT_CWL_PACK_ERROR)

def make_output_dir(options):
    if options.outdir:
        # User requested a specific output directory name
        output_dir_name = options.outdir
    else:
        # Make a new directory name based on the name of the input CWL file
        basename = os.path.basename(options.cwl_filepath)
        fields = basename.split('.')
        if len(fields) > 0:
            output_dir_name = fields[0]
        else:
            exit_with_error("Cannot parse input CWL filepath", EXIT_CWL_PATH_ERROR)

    # Create the output directory if it does not already exist
    if not os.path.exists(output_dir_name):
        os.mkdir(output_dir_name)

    return output_dir_name

def make_asset_paths(asset_names):
    return [pkg_resources.resource_filename(PROGRAM_NAME, os.path.join(ASSETS_DIR_NAME, asset))
               for asset in asset_names]

def copy_web_assets(output_directory):
    asset_names = ['index.html', 'bootstrap.min.css', 'cwl_explorer.css',
        'jquery.qtip.min.css', 'bootstrap.min.js', 'cwl_explorer_utils.js',
        'cytoscape-qtip.js', 'jquery.min.js', 'cwl_explorer.js',
        'cytoscape-dagre.js', 'cytoscape.min.js', 'jquery.qtip.min.js',
        'cwl_explorer_normalise.js', 'cytoscape-expand-collapse.js', 'dagre.min.js',
        'js-yaml.min.js']
    for filename in make_asset_paths(asset_names):
        shutil.copy(filename, output_directory)

def main():
    "Orchestrate the execution of the program"
    options = parse_args()
    init_logging(options.log)
    output_dir = make_output_dir(options)
    pack_cwl(output_dir, options.cwl_filepath)
    copy_web_assets(output_dir)


# If this script is run from the command line then call the main function.
if __name__ == '__main__':
    main()
