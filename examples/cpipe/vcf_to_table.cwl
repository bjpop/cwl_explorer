cwlVersion: v1.0
class: CommandLineTool

label: "vcf_to_table filter"

doc: |

hints:
  SoftwareRequirement:
    packages:
        vcf_to_table.sh:
            specs: [ ]
            version: [ "" ]
inputs:
    post_anno_vcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:

outputs:
    variant_table_tsv:
        type: File
        format: http://edamontology.org/format_3475
        doc:

baseCommand: ["vcf_to_table.sh"]
