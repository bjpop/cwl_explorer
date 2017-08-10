cwlVersion: v1.0
class: Workflow
label: "variant_annotation"
doc:

inputs:
    normalized_g_vcf:
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
    vep_annotated_vcf:
        type: File
        outputSource: vcf_annotate_2/vep_annotated_vcf
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    vcf_annotate:
        run: vcf_annotate.cwl
        label: "vep version 85"
        doc: apply variant effect prediction tools and populate the vcf file.
        in:
            input_vcf: normalized_g_vcf
            vep_cache: [vep_cache]
            reference_assembly_2: [reference_assembly_2]
        out:
            [vep_annotated_vcf]
    vcf_annotate_2:
        run: vcf_annotate.cwl
        label: "dbNSFP, grantham, condel plugin"
        doc: additional variant effect prediction scores
        in:
            input_vcf: vcf_annotate/vep_annotated_vcf
            vep_cache: [vep_cache]
            reference_assembly_2: [reference_assembly_2]
        out:
            [vep_annotated_vcf]
