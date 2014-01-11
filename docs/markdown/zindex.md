## Z-Index

The "stacking" order of vector annotations and WMS layers on the map. For example, imagine you have one record that includes a polygon that traces the shape of Manhattan, and another record that traces the shape of Central Park. Since Central Park is contained inside of Manhattan, you'll want the Central Park polygon to be displayed "on top of" the Manhattan polygon - otherwise, it would be impossible for the user to click on Central Park. 

Z-indexes are just relative numbers that control the display order, with higher numbers stacking above lower numbers. So, in this case, you could set the Z-Index on Manhattan to `1`, and the Z-Index on Central Park to `2`, and Central Park would always be displayed on top of Manhattan.
