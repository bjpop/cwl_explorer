cwlVersion: v1.0
class: Workflow
label: "post_annotation_processing"
doc:

inputs:
    annotated_2_vcf:
        type: File
        format: edam:format_3016
        doc:
outputs:
    transcript_filtered_table:
        type: File
        outputSource: transcript_filter/transcript_filtered_table
        doc: 

requirements:
    - class: SubworkflowFeatureRequirement

steps:
    post_annotate_vep:
        run: post_annotate_vep.cwl
        label: "vep-filter_vep.pl"
        doc: discard variants outside of non-coding regions. Filter based on consequence and biotype fields. Filtering performed to satisfy LOVD requirements.
        in:
            variant: annotated_2_vcf
        out:
            [vep_annotated_vcf]
    vcf_to_table:
        run: post_annotate_vep.cwl
        label: "vcf_to_table.py"
        doc: convert vcf to table to satisfy formatting requirements for LOVD import.
        in:
            variant: post_annotate_vep/vep_annotated_vcf
        out:
            [variant_table_tsv]
    filter_table_forLOVD:
        run: filter_table.cwl
        label: "filter.py"
        doc: filter low quality variant (marked in vcf not removed).
        in:
            table: vcf_to_table/variant_table_tsv
        out:
            [filtered_variant_table]
    lovd_table:
        run: post_annotate_vep.cwl
        label: "filter_lovd.py"
        doc: Expand VEP annotations across columns.
        in:
            variant: filter_table_forLOVD/filtered_variant_table
        out:
            [lovd_compatible_table]
    transcript_filter:
        run: post_annotate_vep.cwl
        label: "filter.py updated XX"
        doc: prioritise in cases where multiple transcripts for LOVD.
        in:
            table: lovd_table/lovd_compatible_table
        out:
            [transcript_filtered_table]
