cwlVersion: v1.0
class: CommandLineTool

label: "convert_table_lovd - for LOVD"

doc: |

hints:
  SoftwareRequirement:
    packages:
        convert_to_lovd.py:
            specs: [  ]
            version: [ "" ]
inputs:
    filtered_variant_table:
        type: File
        format: # table
        doc:

outputs:
    lovd_table:
        type: File
        format:
        doc:

baseCommand: [convert_to_lovd.py]
