cwlVersion: v1.0
class: Workflow
label: "variant_annotation"
doc:

inputs:
    normalized_vcf:
        type: File
        format: edam:format_3016
        doc:
    vep_cache:
        type: File
        format: edam:format_3016
        doc:
    
outputs:
    annotated_2_vcf:
        type: File
        outputSource: vcf_annotate_2/annotated_2_vcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    vcf_annotate:
        run: vcf_annotate.cwl
        label: "vep version 85"
        doc: apply variant effect prediction tools and populate the vcf file.
        in:
            variant: normalized_vcf
            database: [vep_cache]
        out:
            [annotated_vcf]
    vcf_annotate_2:
        run: vcf_annotate.cwl
        label: "grantham, condel plugin"
        doc: additional variant effect prediction scores
        in:
            variant: vcf_annotate/annotated_vcf
        out:
            [annotated_2_vcf]
