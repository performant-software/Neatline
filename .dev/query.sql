SELECT

t1.vector_color,
t2.stroke_color,
t3.select_color,
t4.vector_opacity,
t5.select_opacity,
t6.stroke_opacity,
t7.image_opacity,
t8.stroke_width,
t9.point_radius,
t10.point_image,
t11.max_zoom,
t12.min_zoom

FROM omeka_neatline_records as r

LEFT JOIN omeka_neatline_tags as t1 on r.vector_color = t1.id
LEFT JOIN omeka_neatline_tags as t2 on r.stroke_color = t2.id
LEFT JOIN omeka_neatline_tags as t3 on r.select_color = t3.id
LEFT JOIN omeka_neatline_tags as t4 on r.vector_opacity = t4.id
LEFT JOIN omeka_neatline_tags as t5 on r.select_opacity = t5.id
LEFT JOIN omeka_neatline_tags as t6 on r.stroke_opacity = t6.id
LEFT JOIN omeka_neatline_tags as t7 on r.image_opacity = t7.id
LEFT JOIN omeka_neatline_tags as t8 on r.stroke_width = t8.id
LEFT JOIN omeka_neatline_tags as t9 on r.point_radius = t9.id
LEFT JOIN omeka_neatline_tags as t10 on r.point_image = t10.id
LEFT JOIN omeka_neatline_tags as t11 on r.max_zoom = t11.id
LEFT JOIN omeka_neatline_tags as t12 on r.min_zoom = t12.id;
