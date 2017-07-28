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
  library_coverage_txt:
    type: File 
  exome_coverage_gz:
    type: File 
  ontarget_txt:
    type: File 
  fragments_tsv:
    type: File 
  read_coverage_summary:
    type: File 
  recalibrated_bed:
    type: File 
  recalibrated_bed:
    type: File 
  intersect_bed:
    type: File 
  karyotype_summary:
    type: File 
  insert_size_metrics_txt:
    type: File 
  stage_report_pdf:
    type: File 
