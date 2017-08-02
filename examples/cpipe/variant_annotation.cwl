cwlVersion: v1.0
class: Workflow
label: "variant_annotation"
doc:

inputs:
    normalised_g_vcf:
        type: File
        format: edam:format_3016
        doc:
    vep_cache:
        type: File
        format: edam:format_3016
        doc:
    reference_assembly_2:
        type: File
        format:
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
            normalised_g_vcf: normalised_g_vcf
            vep_cache: [vep_cache]
            reference_assembly_2: [reference_assembly_2]
        out:
            [vep_annotated_vcf]
    vcf_annotate_2:
        run: vcf_annotate.cwl
        label: "dbNSFP, grantham, condel plugin"
        doc: additional variant effect prediction scores
        in:
            annotated_vcf: vcf_annotate/vep_annotated_vcf
        out:
            [annotated_vcf]
