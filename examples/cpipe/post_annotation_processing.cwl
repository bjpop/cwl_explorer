cwlVersion: v1.0
class: Workflow
label: "post_annotation_processing"
doc:

inputs:
    annotated_vcf:
        type: File
        format: edam:format_3016 # vcf
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
            annotated_vcf: annotated_vcf
        out:
            [post_anno_vcf]
    vcf_to_table:
        run: vcf_to_table.cwl
        label: "vcf_to_table.py"
        doc: convert vcf to table to satisfy formatting requirements for LOVD import.
        in:
            post_anno_vcf: post_annotate_vep/post_anno_vcf
        out:
            [variant_table_tsv]
    filter_table:
        run: filter_table.cwl
        label: "filter.py"
        doc: filter low quality variant (marked in vcf not removed).
        in:
            variant_table_tsv: vcf_to_table/variant_table_tsv
        out:
            [filtered_variant_table]
    covert_table_lovd:
        run: convert_table_lovd.cwl
        label: "filter_lovd.py"
        doc: Expand VEP annotations across columns.
        in:
            filtered_variant_table: filter_table/filtered_variant_table
        out:
            [lovd_table]
    transcript_filter:
        run: transcript_filter.cwl
        label: "filter.py updated XX"
        doc: prioritise in cases where multiple transcripts for LOVD.
        in:
            lovd_table: covert_table_lovd/lovd_table
        out:
            [transcript_filtered_table]
