cwlVersion: v1.0
class: CommandLineTool

label: "post_annotate_vep"

doc: |

hints:
  SoftwareRequirement:
    packages:
        filter_vep_pl:
            specs: []
            version: [ "" ]
inputs:
    annotated_vcf:
        type: File
        format: http://edamontology.org/format_3016# vcf
        doc:

    CONSEQUENCE:
        type: string
        doc: "[Consequence not matches stream]"
        inputBinding:
            prefix: '--filter'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    BIOTYPE:
        type: string
        doc: "[BIOTYPE match protein_coding]"
        inputBinding:
            prefix: '--filter'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    FEATURE:
        type: string
        doc: "[Feature]"
        inputBinding:
            prefix: '--filter'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix

outputs:
    post_anno_vcf:
        type: File
        format: http://edamontology.org/format_3016
        doc:

baseCommand: ["filter_vep.pl"]

