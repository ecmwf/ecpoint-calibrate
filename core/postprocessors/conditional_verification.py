from tempfile import NamedTemporaryFile

import metview as mv
import numpy as np


def plot_obs_freq(predictor_matrix, code):
    coastline = mv.mcoast(
        map_coastline_thickness=2, map_boundaries="on", map_coastline_colour="chestnut"
    )
    symbol = mv.msymb(
        legend="on",
        symbol_type="marker",
        symbol_table_mode="on",
        symbol_outline="on",
        symbol_min_table=[1, 2, 5, 10, 15, 20, 25, 30],
        symbol_max_table=[2, 5, 10, 15, 20, 25, 30, 100000],
        symbol_colour_table=[
            "RGB(0.7020,0.7020,0.7020)",
            "RGB(0.4039,0.4039,0.4039)",
            "blue",
            "RGB(0.4980,1.0000,0.0000)",
            "RGB(1.0000,0.8549,0.0000)",
            "orange",
            "red",
            "magenta",
        ],
        symbol_marker_table=15,
        symbol_height_table=0.3,
    )

    legend = mv.mlegend(
        legend_text_font="arial",
        legend_text_font_size=0.35,
        legend_entry_plot_direction="row",
        legend_box_blanking="on",
        legend_entry_text_width=50,
    )

    title = mv.mtext(
        text_line_count=4,
        text_line_1="OBS Frequency",  # To sostitute with "FE" values when relevant.
        text_line_2=f"WT Code = {code}",
        text_line_4=" ",
        text_font="arial",
        text_font_size=0.4,
    )

    df = predictor_matrix[["LonOBS", "LatOBS", "OBS"]]
    grouped_df = df.groupby(["LatOBS", "LonOBS"], as_index=False).count()

    geo = mv.create_geo(len(grouped_df), "xyv")
    geo = mv.set_latitudes(geo, grouped_df["LatOBS"].to_numpy(dtype=np.float))
    geo = mv.set_longitudes(geo, grouped_df["LonOBS"].to_numpy(dtype=np.float))
    geo = mv.set_values(geo, grouped_df["OBS"].to_numpy(dtype=np.float))

    with NamedTemporaryFile(delete=False, suffix=".pdf") as pdf:
        pdf_obj = mv.pdf_output(output_name=pdf.name.replace(".pdf", ""))
        mv.setoutput(pdf_obj)

        mv.plot(coastline, symbol, legend, title, geo)
        return pdf.name


def plot_avg(predictor_matrix, code):
    coastline = mv.mcoast(
        map_coastline_thickness=2, map_boundaries="on", map_coastline_colour="chestnut"
    )

    symbol = mv.msymb(
        legend="on",
        symbol_type="marker",
        symbol_table_mode="on",
        symbol_outline="on",
        symbol_min_table=[-1, -0.25, 0.25, 2],
        symbol_max_table=[-0.025, 0.25, 2, 1000],
        symbol_colour_table=[
            "RGB(0.0000,0.5490,0.1882)",
            "black",
            "RGB(1.0000,0.6902,0.0000)",
            "red",
        ],
        symbol_marker_table=15,
        symbol_height_table=0.3,
    )

    legend = mv.mlegend(
        legend_text_font="arial",
        legend_text_font_size=0.35,
        legend_entry_plot_direction="row",
        legend_box_blanking="on",
        legend_entry_text_width=50,
    )

    error = "FER" if "FER" in predictor_matrix.columns else "FE"

    title = mv.mtext(
        text_line_count=4,
        text_line_1=f"{error} Mean",
        text_line_2=f"WT Code = {code}",
        text_line_4=" ",
        text_font="arial",
        text_font_size=0.4,
    )

    df = predictor_matrix[["LonOBS", "LatOBS", error]]
    grouped_df = df.groupby(["LatOBS", "LonOBS"])[error].mean().reset_index()

    geo = mv.create_geo(len(grouped_df), "xyv")
    geo = mv.set_latitudes(geo, grouped_df["LatOBS"].to_numpy(dtype=np.float))
    geo = mv.set_longitudes(geo, grouped_df["LonOBS"].to_numpy(dtype=np.float))
    geo = mv.set_values(geo, grouped_df[error].to_numpy(dtype=np.float))

    with NamedTemporaryFile(delete=False, suffix=".pdf") as pdf:
        pdf_obj = mv.pdf_output(output_name=pdf.name.replace(".pdf", ""))
        mv.setoutput(pdf_obj)

        mv.plot(coastline, symbol, legend, title, geo)
        return pdf.name


def plot_std(predictor_matrix, code):
    coastline = mv.mcoast(
        map_coastline_thickness=2, map_boundaries="on", map_coastline_colour="chestnut"
    )

    symbol = mv.msymb(
        legend="on",
        symbol_type="marker",
        symbol_table_mode="on",
        symbol_outline="on",
        symbol_min_table=[0, 0.0001, 0.5, 1, 2, 5],
        symbol_max_table=[0.0001, 0.5, 1, 2, 5, 1000],
        symbol_colour_table=[
            "RGB(0.7020,0.7020,0.7020)",
            "RGB(0.2973,0.2973,0.9498)",
            "RGB(0.1521,0.6558,0.5970)",
            "RGB(1.0000,0.6902,0.0000)",
            "red",
            "RGB(1.0000,0.0000,1.0000)",
        ],
        symbol_marker_table=15,
        symbol_height_table=0.3,
    )

    legend = mv.mlegend(
        legend_text_font="arial",
        legend_text_font_size=0.35,
        legend_entry_plot_direction="row",
        legend_box_blanking="on",
        legend_entry_text_width=50,
    )

    error = "FER" if "FER" in predictor_matrix.columns else "FE"

    title = mv.mtext(
        text_line_count=4,
        text_line_1=f"{error} Standard Deviation",
        text_line_2=f"WT Code = {code}",
        text_line_4=" ",
        text_font="arial",
        text_font_size=0.4,
    )

    df = predictor_matrix[["LonOBS", "LatOBS", error]]
    grouped_df = df.groupby(["LatOBS", "LonOBS"])[error].mean().reset_index()

    geo = mv.create_geo(len(grouped_df), "xyv")
    geo = mv.set_latitudes(geo, grouped_df["LatOBS"].to_numpy(dtype=np.float))
    geo = mv.set_longitudes(geo, grouped_df["LonOBS"].to_numpy(dtype=np.float))
    geo = mv.set_values(geo, grouped_df[error].to_numpy(dtype=np.float))

    with NamedTemporaryFile(delete=False, suffix=".pdf") as pdf:
        pdf_obj = mv.pdf_output(output_name=pdf.name.replace(".pdf", ""))
        mv.setoutput(pdf_obj)

        mv.plot(coastline, symbol, legend, title, geo)
        return pdf.name
