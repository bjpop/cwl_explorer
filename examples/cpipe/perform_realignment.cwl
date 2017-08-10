cwlVersion: v1.0
class: CommandLineTool

label: "perform local realignment of indel sites."

doc: |
  https://bio.tools/tool/gatk2_indel_realigner-IP/version/none

hints:
  SoftwareRequirement:
    packages:
        gatk-toolkit:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "3.6" ]
inputs:
    deduped_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc:
    reference_assembly:
        type: File
        format: http://edamontology.org/data_2340
        doc: "hg19 human reference genome"
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
        inputBinding:

    interval_list:
        type: File
        format: http://edamontology.org/format_3475
        doc: Coordinates for regions discovered requiring realignment.

    TARGET_INTERVALS:
        type: string
        doc: "Target interval site input."
        inputBinding:
            prefix: '--targetIntervals'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    deduped_realigned_bam:
        type: File
        format: http://edamontology.org/format_2572
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "IndelRealigner"]

