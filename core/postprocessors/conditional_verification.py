import os
import subprocess
from tempfile import NamedTemporaryFile
from textwrap import dedent

import metview as mv


def plot_obs_freq(predictor_matrix, code):
    df = predictor_matrix[["LatOBS", "LonOBS", "OBS"]]

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

    with NamedTemporaryFile(mode="w", suffix=".geo") as f, NamedTemporaryFile(
        delete=False, suffix=".ps"
    ) as pdf:
        data = df.to_string(index=False, header=False)

        f.write(
            dedent(
                """
        #GEO
        #FORMAT XYV
        # lon-x	lat-y	value
        #DATA
        """
            ).lstrip()
        )
        f.write(data)

        geo = mv.read(f.name)

        ps = mv.ps_output(output_name=pdf.name.replace(".ps", ""))
        mv.setoutput(ps)

        mv.plot(coastline, symbol, legend, title, geo)

        subprocess.call(["ps2pdf", pdf.name], cwd=os.path.dirname(pdf.name))

        return pdf.name.replace(".ps", ".pdf")


def plot_FER_avg(data):
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

    title = mv.mtext(
        text_line_count=4,
        text_line_1="OBS Frequency",  # To sostitute with "FE" values when relevant.
        text_line_2="WT Code = " + WTcode,
        text_line_4=" ",
        text_font="arial",
        text_font_size=0.4,
    )

    ps = mv.ps_output(output_name="./FERav.ps")
    mv.setoutput(ps)
    mv.plot(coastline, symbol, legend, title, data)


def plot_FER_std_dev(data):
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

    title = mv.mtext(
        text_line_count=4,
        text_line_1="OBS Frequency",  # To sostitute with "FE" values when relevant.
        text_line_2="WT Code = " + WTcode,
        text_line_4=" ",
        text_font="arial",
        text_font_size=0.4,
    )

    # Saving map plot as a .ps file
    ps = mv.ps_output(output_name="./FERstd.ps")
    mv.setoutput(ps)
    mv.plot(coastline, symbol, legend, title, data)
