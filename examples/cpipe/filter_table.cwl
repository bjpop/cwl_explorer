cwlVersion: v1.0
class: CommandLineTool

label: "filter_table - based on quality scores"

doc: |

hints:
  SoftwareRequirement:
    packages:
        vcf_to_table.sh:
            specs: [ ]
            version: [ "" ]
inputs:
    variant_table_tsv:
        type: File
        format: http://edamontology.org/format_3475 # table
        doc:

    AD:
        type: string
        doc: "[2]"
        inputBinding:
            prefix: '--ad'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    AF:
        type: string
        doc: "[0.15]"
        inputBinding:
            prefix: '--af'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    DP:
        type: string
        doc: "[5]"
        inputBinding:
            prefix: '--dp'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

    QUAL:
        type: string
        doc: "[5]"
        inputBinding:
            prefix: '--qual'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    filtered_variant_table:
        type: File
        format:
        doc:

baseCommand: ["filter_tsv.py"]

