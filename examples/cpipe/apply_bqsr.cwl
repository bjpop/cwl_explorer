cwlVersion: v1.0
class: CommandLineTool

label: "Apply recalibration to bam file. Overwrites values"

doc: |


hints:
  SoftwareRequirement:
    packages:
        gatk-toolkit:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "3.6" ]
inputs:
    deduped_realigned_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc:

    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
    target_sites:
        type: File
        format: edam:format_3003  # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.

    recalibrated_table:
        type: File
        format: http://edamontology.org/format_3475
        doc: Coordinates for regions discovered requiring realignment.


    BQSR:
        type: string
        doc: "Perform base recalibration."
        inputBinding:
            prefix: '-BQSR'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    recalibrated_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "PrintReads"]
