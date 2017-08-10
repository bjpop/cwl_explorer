cwlVersion: v1.0
class: CommandLineTool

label: "Call variants"

doc: |


hints:
  SoftwareRequirement:
    packages:
        gatk-toolkit:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "3.6" ]

inputs:
    recalibrated_bam:
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
        format:
        doc: "dbsnp reference sites"
        inputBinding:
            prefix: '--dbsnp'
    target_sites:
        type: File
        format: http://edamontology.org/format_3003  # bed
        doc: bed file containing the coordinates for genes/regions to be targeted.



    INTERVAL_PADDING:
        type: string
        doc: "[25]"
        inputBinding:
            prefix: '--interval_padding'
        default: "" # CWL needs a value, we set it to empty default. Maybe fix

outputs:
    raw_variants_vcf:
        type: File
        format: http://edamontology.org/format_3016
        doc:

baseCommand: ["GenomeAnalysisTK.jar", "HaplotypeCaller"]
