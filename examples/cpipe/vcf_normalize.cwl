cwlVersion: v1.0
class: CommandLineTool

label: "vcf normalize"

doc: |
  http://samtools.sourceforge.net/mpileup.shtml

hints:
  SoftwareRequirement:
    packages:
        bcftools:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ "1.3" ]
inputs:
    merged_variants_vcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:

    reference_assembly:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc:
        secondaryFiles: [.fai, .bwt, .sa, .ann, .amb, .pac, .alt]

outputs:
    normalized_g_vcf:
        type: File
        format: http://edamontology.org/format_3016
        doc:

baseCommand: ["bcftools", "norm"]
