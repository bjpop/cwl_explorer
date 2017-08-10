cwlVersion: v1.0
class: CommandLineTool

label: "vcf annotate"

doc: |
    "http://www.ensembl.org/info/docs/tools/vep/index.html"


hints:
  SoftwareRequirement:
    packages:
        vep:
            specs: [ "https://identifiers.org/rrid/RRID:SCR_001876" ]
            version: [ '85' ]
inputs:
    input_vcf:
        type: File
        format: http://edamontology.org/format_3016 # vcf
        doc:

    reference_assembly_2:
        type: File
        format: http://edamontology.org/format_1929 ## fasta
        doc: Homo_sapiens.GRCh37.75.dna.primary_assembly.fa from VEP cache

    vep_cache:
        type: File
        format:
        doc:
    condel_plugin:
        type: string
        doc: "[Condel]"
        inputBinding:
            prefix: '--plugin'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    dbNSFP:
        type: string
        doc: "[dbNSFP]"
        inputBinding:
            prefix: '--plugin'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix
    Grantham_plugin:
        type: string
        doc: "[Grantham]"
        inputBinding:
            prefix: '--plugin'
        default: "" # CWL requires a value here, so we give it an empty default, maybe fix

outputs:
    vep_annotated_vcf:
        type: File
        format:
        doc:

baseCommand: ["variant_effect_predictor.pl"]
