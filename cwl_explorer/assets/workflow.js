"use strict";

const input_workflow =
{
    "cwlVersion": "v1.0", 
    "$graph": [
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#align.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "stdout", 
                    "id": "#align.cwl/ref_aligned_bam"
                }
            ], 
            "id": "#align.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#apply_bqsr.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#apply_bqsr.cwl/recalibrated_bam"
                }
            ], 
            "id": "#apply_bqsr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#bam_quality.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/exome_coverage_gz"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/fragments_tsv"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/intersect_bed"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/karyotype_summary"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/library_coverage_txt"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/ontarget_txt"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/recalibrated_bed"
                }, 
                {
                    "type": "File", 
                    "id": "#bam_quality.cwl/stage_report_pdf"
                }
            ], 
            "id": "#bam_quality.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#bqsr.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#bqsr.cwl/recalibrated_table"
                }
            ], 
            "id": "#bqsr.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#call_variants.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#call_variants.cwl/raw_variants_vcf"
                }
            ], 
            "id": "#call_variants.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "Detect Variants workflow", 
            "doc": "WES pipeline with workflow managed by Bpipe. Auditing and logs generated and managed by Bpipe.", 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "inputs": [
                {
                    "type": "File", 
                    "doc": null, 
                    "id": "#main/annotations_indels"
                }, 
                {
                    "type": "File", 
                    "doc": null, 
                    "id": "#main/annotations_indels_2"
                }, 
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#main/annotations_snps"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#main/forward_reads"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates of exons downloaded from the UCSC database.", 
                    "id": "#main/library_sites"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#main/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#main/reverse_reads"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#main/target_sites"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "database of annotations.", 
                    "id": "#main/vep_cache"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_forward", 
                    "doc": null, 
                    "id": "#main/fastqc_report_forward"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/read_quality_assessment/fastqc_report_reverse", 
                    "doc": null, 
                    "id": "#main/fastqc_report_reverse"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/insert_size_metrics_txt", 
                    "doc": null, 
                    "id": "#main/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/library_coverage_txt", 
                    "doc": null, 
                    "id": "#main/library_coverage_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/read_coverage_summary", 
                    "doc": null, 
                    "id": "#main/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/generate_quality_reports/stage_report_pdf", 
                    "doc": null, 
                    "id": "#main/stage_report_pdf"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#main/post_annotation_processing/transcript_filtered_table", 
                    "doc": null, 
                    "id": "#main/transcript_filtered_table"
                }
            ], 
            "steps": [
                {
                    "run": "#generate_quality_reports.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/library_sites"
                            ], 
                            "id": "#main/generate_quality_reports/library_sites"
                        }, 
                        {
                            "source": "#main/post_alignment_processing/recalibrated_bam", 
                            "id": "#main/generate_quality_reports/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/generate_quality_reports/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/generate_quality_reports/stage_report_pdf", 
                        "#main/generate_quality_reports/library_coverage_txt", 
                        "#main/generate_quality_reports/read_coverage_summary", 
                        "#main/generate_quality_reports/insert_size_metrics_txt"
                    ], 
                    "id": "#main/generate_quality_reports"
                }, 
                {
                    "run": "#post_alignment_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/read_alignment/aligned_merged_bam", 
                            "id": "#main/post_alignment_processing/aligned_merged_bam"
                        }, 
                        {
                            "source": [
                                "#main/annotations_indels"
                            ], 
                            "id": "#main/post_alignment_processing/annotations_indels"
                        }, 
                        {
                            "source": [
                                "#main/annotations_snps"
                            ], 
                            "id": "#main/post_alignment_processing/annotations_snps"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/post_alignment_processing/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/post_alignment_processing/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/post_alignment_processing/recalibrated_bam"
                    ], 
                    "id": "#main/post_alignment_processing"
                }, 
                {
                    "run": "#post_annotation_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/variant_annotation/annotated_2_vcf", 
                            "id": "#main/post_annotation_processing/annotated_2_vcf"
                        }
                    ], 
                    "out": [
                        "#main/post_annotation_processing/transcript_filtered_table"
                    ], 
                    "id": "#main/post_annotation_processing"
                }, 
                {
                    "run": "#post_variant_processing.cwl", 
                    "in": [
                        {
                            "source": "#main/variant_calling/raw_variants_gvcf", 
                            "id": "#main/post_variant_processing/raw_variants_gvcf"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/post_variant_processing/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/post_variant_processing/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/post_variant_processing/normalized_vcf"
                    ], 
                    "id": "#main/post_variant_processing"
                }, 
                {
                    "run": "#read_alignment.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/forward_reads"
                            ], 
                            "id": "#main/read_alignment/forward_reads"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/read_alignment/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/reverse_reads"
                            ], 
                            "id": "#main/read_alignment/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#main/read_alignment/aligned_merged_bam"
                    ], 
                    "id": "#main/read_alignment"
                }, 
                {
                    "run": "#read_quality_assessment.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/forward_reads"
                            ], 
                            "id": "#main/read_quality_assessment/forward_reads"
                        }, 
                        {
                            "source": [
                                "#main/reverse_reads"
                            ], 
                            "id": "#main/read_quality_assessment/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#main/read_quality_assessment/fastqc_report_forward", 
                        "#main/read_quality_assessment/fastqc_report_reverse"
                    ], 
                    "id": "#main/read_quality_assessment"
                }, 
                {
                    "run": "#variant_annotation.cwl", 
                    "in": [
                        {
                            "source": "#main/post_variant_processing/normalized_vcf", 
                            "id": "#main/variant_annotation/normalized_vcf"
                        }, 
                        {
                            "source": [
                                "#main/vep_cache"
                            ], 
                            "id": "#main/variant_annotation/vep_cache"
                        }
                    ], 
                    "out": [
                        "#main/variant_annotation/annotated_2_vcf"
                    ], 
                    "id": "#main/variant_annotation"
                }, 
                {
                    "run": "#variant_calling.cwl", 
                    "in": [
                        {
                            "source": [
                                "#main/annotations_indels"
                            ], 
                            "id": "#main/variant_calling/annotations_indels"
                        }, 
                        {
                            "source": [
                                "#main/annotations_indels_2"
                            ], 
                            "id": "#main/variant_calling/annotations_indels_2"
                        }, 
                        {
                            "source": [
                                "#main/annotations_snps"
                            ], 
                            "id": "#main/variant_calling/annotations_snps"
                        }, 
                        {
                            "source": "#main/post_alignment_processing/recalibrated_bam", 
                            "id": "#main/variant_calling/recalibrated_bam"
                        }, 
                        {
                            "source": [
                                "#main/reference_assembly"
                            ], 
                            "id": "#main/variant_calling/reference_assembly"
                        }, 
                        {
                            "source": [
                                "#main/target_sites"
                            ], 
                            "id": "#main/variant_calling/target_sites"
                        }
                    ], 
                    "out": [
                        "#main/variant_calling/raw_variants_gvcf"
                    ], 
                    "id": "#main/variant_calling"
                }
            ], 
            "id": "#main"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#fastqc.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#fastqc.cwl/forward_report_html"
                }, 
                {
                    "type": "File", 
                    "id": "#fastqc.cwl/reverse_report_html"
                }
            ], 
            "id": "#fastqc.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#filter_table.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#filter_table.cwl/filtered_variant_table"
                }
            ], 
            "id": "#filter_table.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "generate_quality_reports", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates of library captures sites provided by the kit manufacturer.", 
                    "id": "#generate_quality_reports.cwl/library_sites"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_2572", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#generate_quality_reports.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/insert_size_metrics/insert_size_metrics_txt", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/insert_size_metrics_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/calculate_capture_coverage/library_coverage_txt", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/library_coverage_txt"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/calculate_read_depth/read_coverage_summary", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/read_coverage_summary"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#generate_quality_reports.cwl/stage_report/stage_report_pdf", 
                    "doc": null, 
                    "id": "#generate_quality_reports.cwl/stage_report_pdf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#bam_quality.cwl", 
                    "label": "calculate_exon_coverage.py version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/library_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_capture_coverage/bed"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                            "id": "#generate_quality_reports.cwl/calculate_capture_coverage/exome_coverage"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_capture_coverage/library_coverage_txt"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_capture_coverage"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "bedtools-coverageBed version xx", 
                    "in": [
                        {
                            "source": "#generate_quality_reports.cwl/recalibrated_bam", 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/bam"
                        }, 
                        {
                            "source": [
                                "#generate_quality_reports.cwl/library_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_coverage_stats/bed"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                        "#generate_quality_reports.cwl/calculate_coverage_stats/ontarget_txt"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_coverage_stats"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "samtools version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_qc_statistics/bed"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_qc_statistics/fragments_tsv"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_qc_statistics"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "gatk-depthOfCoverage version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/calculate_read_depth/bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/calculate_read_depth/read_coverage_summary"
                    ], 
                    "id": "#generate_quality_reports.cwl/calculate_read_depth"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": null, 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/convert_bam_to_bed/bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/convert_bam_to_bed/recalibrated_bed"
                    ], 
                    "id": "#generate_quality_reports.cwl/convert_bam_to_bed"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "bedtools-intersect", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/library_sites"
                            ], 
                            "id": "#generate_quality_reports.cwl/create_target_exome_bed/bed"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/create_target_exome_bed/intersect_bed"
                    ], 
                    "id": "#generate_quality_reports.cwl/create_target_exome_bed"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "check_karyotype.py updated XX", 
                    "in": [
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                            "id": "#generate_quality_reports.cwl/gender_check/vcf"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/gender_check/karyotype_summary"
                    ], 
                    "id": "#generate_quality_reports.cwl/gender_check"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "picard-collectInsertSizeMetrics version xx", 
                    "in": [
                        {
                            "source": [
                                "#generate_quality_reports.cwl/recalibrated_bam"
                            ], 
                            "id": "#generate_quality_reports.cwl/insert_size_metrics/bam"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/insert_size_metrics/insert_size_metrics_txt"
                    ], 
                    "id": "#generate_quality_reports.cwl/insert_size_metrics"
                }, 
                {
                    "run": "#bam_quality.cwl", 
                    "label": "qc_report.py version xx", 
                    "in": [
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/exome_coverage_gz", 
                            "id": "#generate_quality_reports.cwl/stage_report/exome_coverage"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_qc_statistics/fragments_tsv", 
                            "id": "#generate_quality_reports.cwl/stage_report/fragments_tsv"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/gender_check/karyotype_summary", 
                            "id": "#generate_quality_reports.cwl/stage_report/gender"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_capture_coverage/library_coverage_txt", 
                            "id": "#generate_quality_reports.cwl/stage_report/library_coverage"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_coverage_stats/ontarget_txt", 
                            "id": "#generate_quality_reports.cwl/stage_report/ontarget_coverage"
                        }, 
                        {
                            "source": "#generate_quality_reports.cwl/calculate_read_depth/read_coverage_summary", 
                            "id": "#generate_quality_reports.cwl/stage_report/read_coverage"
                        }
                    ], 
                    "out": [
                        "#generate_quality_reports.cwl/stage_report/stage_report_pdf"
                    ], 
                    "id": "#generate_quality_reports.cwl/stage_report"
                }
            ], 
            "id": "#generate_quality_reports.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#genomic_coord_sort.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#genomic_coord_sort.cwl/sorted_bam"
                }
            ], 
            "id": "#genomic_coord_sort.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#genotypeGVCFs.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#genotypeGVCFs.cwl/raw_variants_gvcf"
                }
            ], 
            "id": "#genotypeGVCFs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#indel_hardfilter.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#indel_hardfilter.cwl/hard_filtered_indel_vcf"
                }
            ], 
            "id": "#indel_hardfilter.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#mark_duplicates.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#mark_duplicates.cwl/dedup_metrics"
                }, 
                {
                    "type": "File", 
                    "id": "#mark_duplicates.cwl/deduped_bam"
                }
            ], 
            "id": "#mark_duplicates.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#merge_alignments.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "stdout", 
                    "id": "#merge_alignments.cwl/aligned_merged_bam"
                }
            ], 
            "id": "#merge_alignments.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#merge_variants.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#merge_variants.cwl/merged_variants_vcf"
                }
            ], 
            "id": "#merge_variants.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#perform_realignment.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#perform_realignment.cwl/merged_dedup_realigned_bam"
                }
            ], 
            "id": "#perform_realignment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_alignment_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/aligned_merged_bam"
                }, 
                {
                    "type": "File", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/annotations_indels"
                }, 
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/annotations_snps"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#post_alignment_processing.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam", 
                    "doc": null, 
                    "id": "#post_alignment_processing.cwl/recalibrated_bam"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#apply_bqsr.cwl", 
                    "label": "gatk-printReads version 3.6", 
                    "doc": "overwrite quality scores with re-calibrated values.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/perform_realignment/merged_dedup_realigned_bam", 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/bam"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/bed"
                        }, 
                        {
                            "source": "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table", 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/bqsr_table"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/apply_recalibration/reference"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/apply_recalibration/recalibrated_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/apply_recalibration"
                }, 
                {
                    "run": "#bqsr.cwl", 
                    "label": "gatk-baseRecalibrator version 3.6", 
                    "doc": "recalibrate quality scores and export to a table. Recalibration performed by readgroup (representing sequencing lanes).", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/perform_realignment/merged_dedup_realigned_bam", 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/bam"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/bed"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/annotations_snps"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/known_sites"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/base_quality_recalibration/reference"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/base_quality_recalibration/recalibrated_table"
                    ], 
                    "id": "#post_alignment_processing.cwl/base_quality_recalibration"
                }, 
                {
                    "run": "#genomic_coord_sort.cwl", 
                    "label": "samtools version 1.3", 
                    "in": [
                        {
                            "source": [
                                "#post_alignment_processing.cwl/aligned_merged_bam"
                            ], 
                            "id": "#post_alignment_processing.cwl/genomic_coord_sort/bam"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/genomic_coord_sort/sorted_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/genomic_coord_sort"
                }, 
                {
                    "run": "#mark_duplicates.cwl", 
                    "label": "picard-markDuplicates", 
                    "doc": "identify pcr duplicates and mark.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/genomic_coord_sort/sorted_bam", 
                            "id": "#post_alignment_processing.cwl/mark_duplicates/bam"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                        "#post_alignment_processing.cwl/mark_duplicates/dedup_metrics"
                    ], 
                    "id": "#post_alignment_processing.cwl/mark_duplicates"
                }, 
                {
                    "run": "#perform_realignment.cwl", 
                    "label": "gatk-IndelRealigner version 3.6", 
                    "doc": "perform realignment and generate new vcf with updated coords.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                            "id": "#post_alignment_processing.cwl/perform_realignment/bam"
                        }, 
                        {
                            "source": "#post_alignment_processing.cwl/realign_intervals/realigned_intervals", 
                            "id": "#post_alignment_processing.cwl/perform_realignment/interval_list"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/perform_realignment/reference"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/perform_realignment/merged_dedup_realigned_bam"
                    ], 
                    "id": "#post_alignment_processing.cwl/perform_realignment"
                }, 
                {
                    "run": "#realign_intervals.cwl", 
                    "label": "gatk-RealignerTargetCreator version 3.6", 
                    "doc": "identify sites in need of realignment using known indel sites as a guide. Sites with high mutation levels also targeted for inspection and potential realignment.", 
                    "in": [
                        {
                            "source": "#post_alignment_processing.cwl/mark_duplicates/deduped_bam", 
                            "id": "#post_alignment_processing.cwl/realign_intervals/bam"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/target_sites"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/bed"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/annotations_indels"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/known_indel_sites"
                        }, 
                        {
                            "source": [
                                "#post_alignment_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_alignment_processing.cwl/realign_intervals/reference"
                        }
                    ], 
                    "out": [
                        "#post_alignment_processing.cwl/realign_intervals/realigned_intervals"
                    ], 
                    "id": "#post_alignment_processing.cwl/realign_intervals"
                }
            ], 
            "id": "#post_alignment_processing.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#post_annotate_vep.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#post_annotate_vep.cwl/lovd_compatible_table"
                }, 
                {
                    "type": "File", 
                    "id": "#post_annotate_vep.cwl/transcript_filtered_table"
                }, 
                {
                    "type": "File", 
                    "id": "#post_annotate_vep.cwl/variant_table_tsv"
                }, 
                {
                    "type": "File", 
                    "id": "#post_annotate_vep.cwl/vep_annotated_vcf"
                }
            ], 
            "id": "#post_annotate_vep.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_annotation_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#post_annotation_processing.cwl/annotated_2_vcf"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table", 
                    "doc": null, 
                    "id": "#post_annotation_processing.cwl/transcript_filtered_table"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#filter_table.cwl", 
                    "label": "filter.py", 
                    "doc": "filter low quality variant (marked in vcf not removed).", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv", 
                            "id": "#post_annotation_processing.cwl/filter_table_forLOVD/table"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/filter_table_forLOVD/filtered_variant_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/filter_table_forLOVD"
                }, 
                {
                    "run": "#post_annotate_vep.cwl", 
                    "label": "filter_lovd.py", 
                    "doc": "Expand VEP annotations across columns.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/filter_table_forLOVD/filtered_variant_table", 
                            "id": "#post_annotation_processing.cwl/lovd_table/variant"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/lovd_table/lovd_compatible_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/lovd_table"
                }, 
                {
                    "run": "#post_annotate_vep.cwl", 
                    "label": "vep-filter_vep.pl", 
                    "doc": "discard variants outside of non-coding regions. Filter based on consequence and biotype fields. Filtering performed to satisfy LOVD requirements.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/annotated_2_vcf", 
                            "id": "#post_annotation_processing.cwl/post_annotate_vep/variant"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/post_annotate_vep/vep_annotated_vcf"
                    ], 
                    "id": "#post_annotation_processing.cwl/post_annotate_vep"
                }, 
                {
                    "run": "#post_annotate_vep.cwl", 
                    "label": "filter.py updated XX", 
                    "doc": "prioritise in cases where multiple transcripts for LOVD.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/lovd_table/lovd_compatible_table", 
                            "id": "#post_annotation_processing.cwl/transcript_filter/table"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/transcript_filter/transcript_filtered_table"
                    ], 
                    "id": "#post_annotation_processing.cwl/transcript_filter"
                }, 
                {
                    "run": "#post_annotate_vep.cwl", 
                    "label": "vcf_to_table.py", 
                    "doc": "convert vcf to table to satisfy formatting requirements for LOVD import.", 
                    "in": [
                        {
                            "source": "#post_annotation_processing.cwl/post_annotate_vep/vep_annotated_vcf", 
                            "id": "#post_annotation_processing.cwl/vcf_to_table/variant"
                        }
                    ], 
                    "out": [
                        "#post_annotation_processing.cwl/vcf_to_table/variant_table_tsv"
                    ], 
                    "id": "#post_annotation_processing.cwl/vcf_to_table"
                }
            ], 
            "id": "#post_annotation_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "post_variant_processing", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": null, 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/raw_variants_gvcf"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#post_variant_processing.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#post_variant_processing.cwl/vcf_normalize/normalized_vcf", 
                    "doc": null, 
                    "id": "#post_variant_processing.cwl/normalized_vcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#indel_hardfilter.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "apply hard quality filters on allelic depth etc.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/hard_filter_indels/reference"
                        }, 
                        {
                            "source": "#post_variant_processing.cwl/select_indels/indel_vcf", 
                            "id": "#post_variant_processing.cwl/hard_filter_indels/variant"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/hard_filter_indels/hard_filtered_indel_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/hard_filter_indels"
                }, 
                {
                    "run": "#snv_hardfilter.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "apply hard quality filters on allelic depth, etc.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/hard_filter_snvs/reference"
                        }, 
                        {
                            "source": "#post_variant_processing.cwl/select_snvs/snv_vcf", 
                            "id": "#post_variant_processing.cwl/hard_filter_snvs/variant"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/hard_filter_snvs/hard_filtered_snv_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/hard_filter_snvs"
                }, 
                {
                    "run": "#merge_variants.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "merge filtered indel and snv vcfs", 
                    "in": [
                        {
                            "source": "#post_variant_processing.cwl/hard_filter_indels/hard_filtered_indel_vcf", 
                            "id": "#post_variant_processing.cwl/merge_variants/indels"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/merge_variants/reference"
                        }, 
                        {
                            "source": "#post_variant_processing.cwl/hard_filter_snvs/hard_filtered_snv_vcf", 
                            "id": "#post_variant_processing.cwl/merge_variants/snvs"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/merge_variants/merged_variants_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/merge_variants"
                }, 
                {
                    "run": "#select_indels.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract indel mutations only. This is necessary so that indel-specific filters can be applied.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/select_indels/reference"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_gvcf"
                            ], 
                            "id": "#post_variant_processing.cwl/select_indels/variant"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/select_indels/indel_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/select_indels"
                }, 
                {
                    "run": "#select_snvs.cwl", 
                    "label": "gatk-selectVariants version 3.6", 
                    "doc": "extract all but indel mutations types so that hard filters can be applied.", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/select_snvs/reference"
                        }, 
                        {
                            "source": [
                                "#post_variant_processing.cwl/raw_variants_gvcf"
                            ], 
                            "id": "#post_variant_processing.cwl/select_snvs/variant"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/select_snvs/snv_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/select_snvs"
                }, 
                {
                    "run": "#vcf_normalize.cwl", 
                    "label": "bcftools version 1.3", 
                    "doc": "normalisation and split multi-allelic sites", 
                    "in": [
                        {
                            "source": [
                                "#post_variant_processing.cwl/reference_assembly"
                            ], 
                            "id": "#post_variant_processing.cwl/vcf_normalize/reference"
                        }, 
                        {
                            "source": "#post_variant_processing.cwl/merge_variants/merged_variants_vcf", 
                            "id": "#post_variant_processing.cwl/vcf_normalize/variant"
                        }
                    ], 
                    "out": [
                        "#post_variant_processing.cwl/vcf_normalize/normalized_vcf"
                    ], 
                    "id": "#post_variant_processing.cwl/vcf_normalize"
                }
            ], 
            "id": "#post_variant_processing.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_alignment", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/forward_reads"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#read_alignment.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/reverse_reads"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#read_alignment.cwl/merge_alignments/aligned_merged_bam", 
                    "doc": null, 
                    "id": "#read_alignment.cwl/aligned_merged_bam"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#align.cwl", 
                    "label": "bwa-mem version 0.7.13", 
                    "doc": "align a sequencing lane to the reference assembly using bwa-mem algorithm. mem does not perform local realignment.", 
                    "in": [
                        {
                            "source": [
                                "#read_alignment.cwl/forward_reads"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/forward_reads"
                        }, 
                        {
                            "source": [
                                "#read_alignment.cwl/reference_assembly"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/reference"
                        }, 
                        {
                            "source": [
                                "#read_alignment.cwl/reverse_reads"
                            ], 
                            "id": "#read_alignment.cwl/align_to_ref/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#read_alignment.cwl/align_to_ref/ref_aligned_bam"
                    ], 
                    "id": "#read_alignment.cwl/align_to_ref"
                }, 
                {
                    "run": "#merge_alignments.cwl", 
                    "label": "picard-mergSamFiles v2.6.0", 
                    "doc": "merge individual alignments representing sequencing lanes.", 
                    "in": [
                        {
                            "source": "#read_alignment.cwl/align_to_ref/ref_aligned_bam", 
                            "id": "#read_alignment.cwl/merge_alignments/bam"
                        }
                    ], 
                    "out": [
                        "#read_alignment.cwl/merge_alignments/aligned_merged_bam"
                    ], 
                    "id": "#read_alignment.cwl/merge_alignments"
                }
            ], 
            "id": "#read_alignment.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "read_quality_assessment", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/forward_reads"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_1930", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/reverse_reads"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#read_quality_assessment.cwl/read_quality/forward_report_html", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/fastqc_report_forward"
                }, 
                {
                    "type": "File", 
                    "outputSource": "#read_quality_assessment.cwl/read_quality/reverse_report_html", 
                    "doc": null, 
                    "id": "#read_quality_assessment.cwl/fastqc_report_reverse"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#fastqc.cwl", 
                    "label": "fastQC version 0.11.5", 
                    "doc": "Initial and cursory check for common issues arising as part of the sequencing process related to read quality. Separate reports generated for each lane x read.", 
                    "in": [
                        {
                            "source": [
                                "#read_quality_assessment.cwl/forward_reads"
                            ], 
                            "id": "#read_quality_assessment.cwl/read_quality/forward_reads"
                        }, 
                        {
                            "source": [
                                "#read_quality_assessment.cwl/reverse_reads"
                            ], 
                            "id": "#read_quality_assessment.cwl/read_quality/reverse_reads"
                        }
                    ], 
                    "out": [
                        "#read_quality_assessment.cwl/read_quality/forward_report_html", 
                        "#read_quality_assessment.cwl/read_quality/reverse_report_html"
                    ], 
                    "id": "#read_quality_assessment.cwl/read_quality"
                }
            ], 
            "id": "#read_quality_assessment.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#realign_intervals.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#realign_intervals.cwl/realigned_intervals"
                }
            ], 
            "id": "#realign_intervals.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#select_indels.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#select_indels.cwl/indel_vcf"
                }
            ], 
            "id": "#select_indels.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#select_snvs.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#select_snvs.cwl/snv_vcf"
                }
            ], 
            "id": "#select_snvs.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#snv_hardfilter.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#snv_hardfilter.cwl/hard_filtered_snv_vcf"
                }
            ], 
            "id": "#snv_hardfilter.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "variant_annotation", 
            "doc": null, 
            "inputs": [
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/normalized_vcf"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3016", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/vep_cache"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#variant_annotation.cwl/vcf_annotate_2/annotated_2_vcf", 
                    "doc": null, 
                    "id": "#variant_annotation.cwl/annotated_2_vcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#vcf_annotate.cwl", 
                    "label": "vep version 85", 
                    "doc": "apply variant effect prediction tools and populate the vcf file.", 
                    "in": [
                        {
                            "source": [
                                "#variant_annotation.cwl/vep_cache"
                            ], 
                            "id": "#variant_annotation.cwl/vcf_annotate/database"
                        }, 
                        {
                            "source": "#variant_annotation.cwl/normalized_vcf", 
                            "id": "#variant_annotation.cwl/vcf_annotate/variant"
                        }
                    ], 
                    "out": [
                        "#variant_annotation.cwl/vcf_annotate/annotated_vcf"
                    ], 
                    "id": "#variant_annotation.cwl/vcf_annotate"
                }, 
                {
                    "run": "#vcf_annotate.cwl", 
                    "label": "grantham, condel plugin", 
                    "doc": "additional variant effect prediction scores", 
                    "in": [
                        {
                            "source": "#variant_annotation.cwl/vcf_annotate/annotated_vcf", 
                            "id": "#variant_annotation.cwl/vcf_annotate_2/variant"
                        }
                    ], 
                    "out": [
                        "#variant_annotation.cwl/vcf_annotate_2/annotated_2_vcf"
                    ], 
                    "id": "#variant_annotation.cwl/vcf_annotate_2"
                }
            ], 
            "id": "#variant_annotation.cwl"
        }, 
        {
            "class": "Workflow", 
            "label": "variant_calling", 
            "doc": "This is some documentation", 
            "inputs": [
                {
                    "type": "File", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#variant_calling.cwl/annotations_indels"
                }, 
                {
                    "type": "File", 
                    "format": null, 
                    "doc": "1000G phase 3v4", 
                    "id": "#variant_calling.cwl/annotations_indels_2"
                }, 
                {
                    "type": "File", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_1106", 
                    "secondaryFiles": [
                        ".tbi"
                    ], 
                    "doc": null, 
                    "id": "#variant_calling.cwl/annotations_snps"
                }, 
                {
                    "type": "File", 
                    "id": "#variant_calling.cwl/recalibrated_bam"
                }, 
                {
                    "type": "File", 
                    "label": "ref_assembly_buildhg19", 
                    "format": "file:///Users/bjpop/code/cwl_explorer/examples/cpipe/data_2340", 
                    "secondaryFiles": [
                        ".fai", 
                        "^.dict"
                    ], 
                    "doc": null, 
                    "id": "#variant_calling.cwl/reference_assembly"
                }, 
                {
                    "type": "File", 
                    "format": "edam:format_3003", 
                    "doc": "bed file containing coordinates for intersection of exons and library captures sites.", 
                    "id": "#variant_calling.cwl/target_sites"
                }
            ], 
            "outputs": [
                {
                    "type": "File", 
                    "outputSource": "#variant_calling.cwl/genotypeGVCFs/raw_variants_gvcf", 
                    "doc": null, 
                    "id": "#variant_calling.cwl/raw_variants_gvcf"
                }
            ], 
            "requirements": [
                {
                    "class": "SubworkflowFeatureRequirement"
                }
            ], 
            "steps": [
                {
                    "run": "#call_variants.cwl", 
                    "label": "gatk-HaplotypeCaller version 3.6", 
                    "doc": "simultaneous call of indels and snvs across target region sites. dbsnp ID annotated to file for referencing purposes.", 
                    "in": [
                        {
                            "source": [
                                "#variant_calling.cwl/recalibrated_bam"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/bam"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/target_sites"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/bed"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/annotations_indels"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/known_indels"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/annotations_snps"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/known_snps"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ], 
                            "id": "#variant_calling.cwl/call_variants/reference"
                        }
                    ], 
                    "out": [
                        "#variant_calling.cwl/call_variants/raw_variants_vcf"
                    ], 
                    "id": "#variant_calling.cwl/call_variants"
                }, 
                {
                    "run": "#genotypeGVCFs.cwl", 
                    "label": "gatk-genotypeGVCF version 3.6", 
                    "doc": "genotypeGVCF is a redundant stage for singleton pipeline. Stage is performed but functionality not relevant to downstream stages. Sample-by-sample calling employed for sample consistency and independence.", 
                    "in": [
                        {
                            "source": [
                                "#variant_calling.cwl/annotations_indels_2"
                            ], 
                            "id": "#variant_calling.cwl/genotypeGVCFs/known_indels"
                        }, 
                        {
                            "source": [
                                "#variant_calling.cwl/reference_assembly"
                            ], 
                            "id": "#variant_calling.cwl/genotypeGVCFs/reference"
                        }, 
                        {
                            "source": "#variant_calling.cwl/call_variants/raw_variants_vcf", 
                            "id": "#variant_calling.cwl/genotypeGVCFs/variant"
                        }
                    ], 
                    "out": [
                        "#variant_calling.cwl/genotypeGVCFs/raw_variants_gvcf"
                    ], 
                    "id": "#variant_calling.cwl/genotypeGVCFs"
                }
            ], 
            "id": "#variant_calling.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#vcf_annotate.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#vcf_annotate.cwl/annotated_2_vcf"
                }, 
                {
                    "type": "File", 
                    "id": "#vcf_annotate.cwl/annotated_vcf"
                }
            ], 
            "id": "#vcf_annotate.cwl"
        }, 
        {
            "class": "CommandLineTool", 
            "inputs": [
                {
                    "type": "string", 
                    "doc": "The message to print", 
                    "default": "Hello World", 
                    "inputBinding": {
                        "position": 1
                    }, 
                    "id": "#vcf_normalize.cwl/message"
                }
            ], 
            "baseCommand": "echo", 
            "arguments": [
                "-n", 
                "-e"
            ], 
            "stdout": "response.txt", 
            "outputs": [
                {
                    "type": "File", 
                    "id": "#vcf_normalize.cwl/normalized_vcf"
                }
            ], 
            "id": "#vcf_normalize.cwl"
        }
    ]
};
