cwlVersion: v1.0
class: CommandLineTool

label: "discover indel sites in need of realignment."

doc: |
  https://bio.tools/tool/gatk2_realigner_target_c/version/none

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
    known_indel_sites:
        type: File
        format:
        doc: "Mills & 1000G reference indels"
    target_sites:
        type: File
        format: http://edamontology.org/format_3003 # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.

    INTERVAL_PADDING:
        type: string
        doc: ". INT [25]"
        inputBinding:
            prefix: '--interval_padding'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

    KNOWN_SITES:
        type: string
        format:  ## vcf
        doc: "Description of purpose. VCF file"
        inputBinding:
            prefix: '--known'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix


outputs:
    realigned_intervals:
        type: File
        format: http://edamontology.org/format_3475
        doc: Coordinates for regions discovered requiring realignment.

baseCommand: ["GenomeAnalysisTK.jar", "RealignerTargetCreator"]

