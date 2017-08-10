cwlVersion: v1.0
class: CommandLineTool

label: "Calculate recalibration values for base recalibration."

doc: |
    https://bio.tools/tool/gatk2_base_recalibrator-/version/none

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
        format: http://edamontology.org/format_XXXX ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]
    known_snp_sites:
        type: File
        format: "https://identifiers.org/rrid/RRID:SCR_002338"
        doc: "dbsnp reference sites"
    target_sites:
        type: File
        format: http://edamontology.org/format_3003  # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.


    REFERENCE:
        type: string
        doc: "Reference library input name."
        inputBinding:
            prefix: '-R'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix
    TARGETINTERVALS:
        type: string
        doc: "Target interval site input."
        inputBinding:
            prefix: '--targetIntervals'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    recalibrated_table:
        type: File
        format:
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "BaseRecalibrator"]

