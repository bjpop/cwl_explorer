#!/usr/bin/env python

'''
Module      : Main 
Description : The main entry point for the program.
Copyright   : (c) Bernie Pope, 2017 
License     : MIT 
Maintainer  : bjpope@unimelb.edu.au
Portability : POSIX

Convert a subset of the EDAM ontology in CSV format into JSON
'''

from __future__ import print_function
from argparse import ArgumentParser
import sys
import logging
import csv
import json


EXIT_FILE_IO_ERROR = 1
EXIT_COMMAND_LINE_ERROR = 2
DEFAULT_VERBOSE = False
PROGRAM_NAME = "edam_to_json.py"
PROGRAM_VERSION = "1.0"


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
    parser = ArgumentParser(description='Convert a subset of EDAM into JSON')
    parser.add_argument('--version',
        action='version',
        version='%(prog)s ' + PROGRAM_VERSION)
    parser.add_argument('--log',
        metavar='LOG_FILE',
        type=str,
        help='record program progress in LOG_FILE')
    parser.add_argument('edam_filepath',
        metavar='EDAM_FILE',
        type=str,
        help='Input EDAM file path')
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

def edam_to_json(filepath):
    result = {} 
    with open(filepath) as file:
        reader = csv.DictReader(file)
        for row in reader:
            class_id = row['Class ID']
            label = row['Preferred Label']
            definitions = row['Definitions']
            prefixIRI = row['http://data.bioontology.org/metadata/prefixIRI']
            result[prefixIRI] = {'class_id': class_id, 'label': label, 'definitions': definitions}
    print(json.dumps(result))

def main():
    "Orchestrate the execution of the program"
    options = parse_args()
    init_logging(options.log)
    edam_to_json(options.edam_filepath)


# If this script is run from the command line then call the main function.
if __name__ == '__main__':
    main()
