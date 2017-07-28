cwlVersion: v1.0
class: CommandLineTool
inputs:
  message:
    type: string
    doc: "The message to print"
    default: "Hello World"
    inputBinding:
      position: 1
baseCommand: echo
arguments:
   - "-n"
   - "-e"
stdout: response.txt
outputs:
  lovd_compatible_table:
    type: File 
  vep_annotated_vcf:
    type: File
  transcript_filtered_table:
    type: File
  variant_table_tsv:
    type: File
