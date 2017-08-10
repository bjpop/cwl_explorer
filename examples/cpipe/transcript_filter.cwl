cwlVersion: v1.0
class: CommandLineTool

label: "transcript_filter - remove multiple transcripts"

doc: |

hints:
  SoftwareRequirement:
    packages:
        filter_transcripts.py:
            specs: [  ]
            version: [ "" ]
inputs:
    lovd_table:
        type: File
        format: # table
        doc:

outputs:
    transcript_filtered_table:
        type: File
        format:
        doc:

baseCommand: ["filter_transcripts.py"]
