<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


 /**
  * 2.6.0 schema.
  */
function nl_schema260()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

       id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
       owner_id                INT(10) UNSIGNED NOT NULL,
       added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       modified                TIMESTAMP NULL,
       published               TIMESTAMP NULL,
       item_query              TEXT NULL,
       spatial_layers          TEXT NULL,
       spatial_layer           TEXT NULL,
       image_layer             TEXT NULL,
       image_height            SMALLINT UNSIGNED NULL,
       image_width             SMALLINT UNSIGNED NULL,
       zoom_levels             SMALLINT UNSIGNED NULL,
       wms_address             TEXT NULL,
       wms_layers              TEXT NULL,
       widgets                 TEXT NULL,
       title                   TEXT NULL,
       slug                    VARCHAR(100) NOT NULL,
       narrative               LONGTEXT NULL,
       spatial_querying        TINYINT(1) NOT NULL,
       public                  TINYINT(1) NOT NULL,
       styles                  TEXT NULL,
       map_focus               VARCHAR(100) NULL,
       map_zoom                INT(10) UNSIGNED NULL,
       accessible_url          TEXT NULL,
       map_restricted_extent   TEXT NULL,
       map_min_zoom            SMALLINT UNSIGNED NULL,
       map_max_zoom            SMALLINT UNSIGNED NULL,

       PRIMARY KEY             (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    get_db()->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

       id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
       owner_id                INT(10) UNSIGNED NOT NULL,
       item_id                 INT(10) UNSIGNED NULL,
       exhibit_id              INT(10) UNSIGNED NULL,
       added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       modified                TIMESTAMP NULL,
       is_coverage             TINYINT(1) NOT NULL,
       is_wms                  TINYINT(1) NOT NULL,
       slug                    VARCHAR(100) NULL,
       title                   MEDIUMTEXT NULL,
       item_title              MEDIUMTEXT NULL,
       body                    MEDIUMTEXT NULL,
       coverage                GEOMETRY NOT NULL,
       tags                    TEXT NULL,
       widgets                 TEXT NULL,
       presenter               VARCHAR(100) NULL,
       fill_color              VARCHAR(100) NULL,
       fill_color_select       VARCHAR(100) NULL,
       stroke_color            VARCHAR(100) NULL,
       stroke_color_select     VARCHAR(100) NULL,
       fill_opacity            DECIMAL(3,2) NULL,
       fill_opacity_select     DECIMAL(3,2) NULL,
       stroke_opacity          DECIMAL(3,2) NULL,
       stroke_opacity_select   DECIMAL(3,2) NULL,
       stroke_width            INT(10) UNSIGNED NULL,
       point_radius            INT(10) UNSIGNED NULL,
       zindex                  INT(10) UNSIGNED NULL,
       weight                  INT(10) UNSIGNED NULL,
       start_date              VARCHAR(100) NULL,
       end_date                VARCHAR(100) NULL,
       after_date              VARCHAR(100) NULL,
       before_date             VARCHAR(100) NULL,
       point_image             VARCHAR(100) NULL,
       wms_address             TEXT NULL,
       wms_layers              TEXT NULL,
       min_zoom                INT(10) UNSIGNED NULL,
       max_zoom                INT(10) UNSIGNED NULL,
       map_zoom                INT(10) UNSIGNED NULL,
       map_focus               VARCHAR(100) NULL,

       PRIMARY KEY             (id),

       INDEX                   (added),
       INDEX                   (exhibit_id, item_id),
       INDEX                   (min_zoom, max_zoom),
       SPATIAL INDEX           (coverage),

       FULLTEXT INDEX          (title, body, slug),
       FULLTEXT INDEX          (tags),
       FULLTEXT INDEX          (widgets)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}


/**
 * 2.5.2 schema.
 */
function nl_schema252()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        item_query              TEXT NULL,
        spatial_layers          TEXT NULL,
        spatial_layer           TEXT NULL,
        image_layer             TEXT NULL,
        image_height            SMALLINT UNSIGNED NULL,
        image_width             SMALLINT UNSIGNED NULL,
        zoom_levels             SMALLINT UNSIGNED NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
        spatial_querying        TINYINT(1) NOT NULL,
        public                  TINYINT(1) NOT NULL,
        styles                  TEXT NULL,
        map_focus               VARCHAR(100) NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        accessible_url          TEXT NULL,

        PRIMARY KEY             (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    get_db()->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NOT NULL,
        is_wms                  TINYINT(1) NOT NULL,
        slug                    VARCHAR(100) NULL,
        title                   MEDIUMTEXT NULL,
        item_title              MEDIUMTEXT NULL,
        body                    MEDIUMTEXT NULL,
        coverage                GEOMETRY NOT NULL,
        tags                    TEXT NULL,
        widgets                 TEXT NULL,
        presenter               VARCHAR(100) NULL,
        fill_color              VARCHAR(100) NULL,
        fill_color_select       VARCHAR(100) NULL,
        stroke_color            VARCHAR(100) NULL,
        stroke_color_select     VARCHAR(100) NULL,
        fill_opacity            DECIMAL(3,2) NULL,
        fill_opacity_select     DECIMAL(3,2) NULL,
        stroke_opacity          DECIMAL(3,2) NULL,
        stroke_opacity_select   DECIMAL(3,2) NULL,
        stroke_width            INT(10) UNSIGNED NULL,
        point_radius            INT(10) UNSIGNED NULL,
        zindex                  INT(10) UNSIGNED NULL,
        weight                  INT(10) UNSIGNED NULL,
        start_date              VARCHAR(100) NULL,
        end_date                VARCHAR(100) NULL,
        after_date              VARCHAR(100) NULL,
        before_date             VARCHAR(100) NULL,
        point_image             VARCHAR(100) NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),

        INDEX                   (added),
        INDEX                   (exhibit_id, item_id),
        INDEX                   (min_zoom, max_zoom),
        SPATIAL INDEX           (coverage),

        FULLTEXT INDEX          (title, body, slug),
        FULLTEXT INDEX          (tags),
        FULLTEXT INDEX          (widgets)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}



/**
 * 2.4.3 schema.
 */
function nl_schema243()
{

    $db = get_db();
    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        item_query              TEXT NULL,
        spatial_layers          TEXT NULL,
        spatial_layer           TEXT NULL,
        image_layer             TEXT NULL,
        image_height            SMALLINT UNSIGNED NULL,
        image_width             SMALLINT UNSIGNED NULL,
        zoom_levels             SMALLINT UNSIGNED NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
        spatial_querying        TINYINT(1) NOT NULL,
        public                  TINYINT(1) NOT NULL,
        styles                  TEXT NULL,
        map_focus               VARCHAR(100) NULL,
        map_zoom                INT(10) UNSIGNED NULL,

        PRIMARY KEY             (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);
    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NOT NULL,
        is_wms                  TINYINT(1) NOT NULL,
        slug                    VARCHAR(100) NULL,
        title                   MEDIUMTEXT NULL,
        item_title              MEDIUMTEXT NULL,
        body                    MEDIUMTEXT NULL,
        coverage                GEOMETRY NOT NULL,
        tags                    TEXT NULL,
        widgets                 TEXT NULL,
        presenter               VARCHAR(100) NULL,
        fill_color              VARCHAR(100) NULL,
        fill_color_select       VARCHAR(100) NULL,
        stroke_color            VARCHAR(100) NULL,
        stroke_color_select     VARCHAR(100) NULL,
        fill_opacity            DECIMAL(3,2) NULL,
        fill_opacity_select     DECIMAL(3,2) NULL,
        stroke_opacity          DECIMAL(3,2) NULL,
        stroke_opacity_select   DECIMAL(3,2) NULL,
        stroke_width            INT(10) UNSIGNED NULL,
        point_radius            INT(10) UNSIGNED NULL,
        zindex                  INT(10) UNSIGNED NULL,
        weight                  INT(10) UNSIGNED NULL,
        start_date              VARCHAR(100) NULL,
        end_date                VARCHAR(100) NULL,
        after_date              VARCHAR(100) NULL,
        before_date             VARCHAR(100) NULL,
        point_image             VARCHAR(100) NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),

        INDEX                   (added),
        INDEX                   (exhibit_id, item_id),
        INDEX                   (min_zoom, max_zoom),
        SPATIAL INDEX           (coverage),

        FULLTEXT INDEX          (item_title, title, body, slug),
        FULLTEXT INDEX          (tags),
        FULLTEXT INDEX          (widgets)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}

/**
 * 2.2.0 schema.
 */
function nl_schema220()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        item_query              TEXT NULL,
        spatial_layers          TEXT NULL,
        spatial_layer           TEXT NULL,
        image_layer             TEXT NULL,
        image_height            SMALLINT UNSIGNED NULL,
        image_width             SMALLINT UNSIGNED NULL,
        zoom_levels             SMALLINT UNSIGNED NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
        spatial_querying        TINYINT(1) NOT NULL,
        public                  TINYINT(1) NOT NULL,
        styles                  TEXT NULL,
        map_focus               VARCHAR(100) NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_restricted_extent   VARCHAR(100) NULL,
        map_min_zoom            INT(10) UNSIGNED NULL,
        map_max_zoom            INT(10) UNSIGNED NULL,

        PRIMARY KEY             (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    get_db()->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NOT NULL,
        is_wms                  TINYINT(1) NOT NULL,
        slug                    VARCHAR(100) NULL,
        title                   MEDIUMTEXT NULL,
        item_title              MEDIUMTEXT NULL,
        body                    MEDIUMTEXT NULL,
        coverage                GEOMETRY NOT NULL,
        tags                    TEXT NULL,
        widgets                 TEXT NULL,
        presenter               VARCHAR(100) NULL,
        fill_color              VARCHAR(100) NULL,
        fill_color_select       VARCHAR(100) NULL,
        stroke_color            VARCHAR(100) NULL,
        stroke_color_select     VARCHAR(100) NULL,
        fill_opacity            DECIMAL(3,2) NULL,
        fill_opacity_select     DECIMAL(3,2) NULL,
        stroke_opacity          DECIMAL(3,2) NULL,
        stroke_opacity_select   DECIMAL(3,2) NULL,
        stroke_width            INT(10) UNSIGNED NULL,
        point_radius            INT(10) UNSIGNED NULL,
        zindex                  INT(10) UNSIGNED NULL,
        weight                  INT(10) UNSIGNED NULL,
        start_date              VARCHAR(100) NULL,
        end_date                VARCHAR(100) NULL,
        after_date              VARCHAR(100) NULL,
        before_date             VARCHAR(100) NULL,
        point_image             VARCHAR(100) NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),

        INDEX                   (added),
        INDEX                   (exhibit_id, item_id),
        INDEX                   (min_zoom, max_zoom),
        SPATIAL INDEX           (coverage),

        FULLTEXT INDEX          (title, body, slug),
        FULLTEXT INDEX          (tags),
        FULLTEXT INDEX          (widgets)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}


/**
 * 2.0.2 schema.
 */
function nl_schema202()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        item_query              TEXT NULL,
        spatial_layers          TEXT NULL,
        spatial_layer           TEXT NULL,
        image_layer             TEXT NULL,
        image_height            SMALLINT UNSIGNED NULL,
        image_width             SMALLINT UNSIGNED NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
        spatial_querying        TINYINT(1) NOT NULL,
        public                  TINYINT(1) NOT NULL,
        styles                  TEXT NULL,
        map_focus               VARCHAR(100) NULL,
        map_zoom                INT(10) UNSIGNED NULL,

        PRIMARY KEY            (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NOT NULL,
        is_wms                  TINYINT(1) NOT NULL,
        slug                    VARCHAR(100) NULL,
        title                   MEDIUMTEXT NULL,
        body                    MEDIUMTEXT NULL,
        coverage                GEOMETRY NOT NULL,
        tags                    TEXT NULL,
        widgets                 TEXT NULL,
        presenter               VARCHAR(100) NULL,
        fill_color              VARCHAR(100) NULL,
        fill_color_select       VARCHAR(100) NULL,
        stroke_color            VARCHAR(100) NULL,
        stroke_color_select     VARCHAR(100) NULL,
        fill_opacity            DECIMAL(3,2) NULL,
        fill_opacity_select     DECIMAL(3,2) NULL,
        stroke_opacity          DECIMAL(3,2) NULL,
        stroke_opacity_select   DECIMAL(3,2) NULL,
        stroke_width            INT(10) UNSIGNED NULL,
        point_radius            INT(10) UNSIGNED NULL,
        zindex                  INT(10) UNSIGNED NULL,
        weight                  INT(10) UNSIGNED NULL,
        start_date              VARCHAR(100) NULL,
        end_date                VARCHAR(100) NULL,
        after_date              VARCHAR(100) NULL,
        before_date             VARCHAR(100) NULL,
        point_image             VARCHAR(100) NULL,
        wms_address             TEXT NULL,
        wms_layers              TEXT NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),

        INDEX                   (item_id, exhibit_id),
        SPATIAL INDEX           (coverage),

        FULLTEXT INDEX          (title, body, slug),
        FULLTEXT INDEX          (tags),
        FULLTEXT INDEX          (widgets)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}
