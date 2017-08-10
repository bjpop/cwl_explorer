cwlVersion: v1.0
class: CommandLineTool

label: "bam_quality - calculate coverage statistics"

doc: |
  'https://github.com/arq5x/bedtools2'
hints:
  SoftwareRequirement:
    packages:
        bedtools:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_006646" ]
            version: [ "2.25.0" ]
inputs:
    recalibrated_bam:
        type: File
        format:
        doc:
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    library_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing the library sites.
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    reference_assembly:
        type: File
        format: http://edamontology.org/format_XXXX ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    gender:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing the library sites.
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    dedup_metrics:
        type: File
        format: http://edamontology.org/format_XXXX
        doc: Text file containing summaries of duplicate metrics.
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    recalibrated_bed:
        type: File
        format: http://edamontology.org/format_3003
        doc:
    intersect_bed:
        type: File
        format: http://edamontology.org/format_3003
        doc:
    exome_coverage_gz:
        type: File
        format:
        doc:
    intersect_cov_gz:
        type: File
        format:
        doc:
    karyotype_summary:
        type: File
        format:
        doc:
    insert_size_metrics_txt:
        type: File
        format:
        doc:
    read_coverage_summary:
        type: File
        format:
        doc:
    fragments_tsv:
        type: File
        format: http://edamontology.org/format_3475
        doc:
    stage_report_pdf:
        type: File
        format:
        doc:
    ontarget_txt:
        type: File
        format:
        doc:

baseCommand: ["bedtools"]

