<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


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
 * 2.1.2 schema.
 */
function nl_schema212()
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


/**
 * 2.0.0 schema.
 */
function nl_schema200()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        query                   TEXT NULL,
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
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NULL,
        is_wms                  TINYINT(1) NULL,
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


/**
 * 2.0.0-rc4 schema.
 */
function nl_schema200rc4()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        query                   TEXT NULL,
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
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NULL,
        is_wms                  TINYINT(1) NULL,
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


/**
 * 2.0.0-rc3 schema.
 */
function nl_schema200rc3()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        query                   TEXT NULL,
        base_layers             TEXT NULL,
        base_layer              VARCHAR(100) NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
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
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NULL,
        is_wms                  TINYINT(1) NULL,
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
        wms_address             VARCHAR(100) NULL,
        wms_layers              VARCHAR(100) NULL,
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


/**
 * 2.0.0-rc1 schema.
 */
function nl_schema200rc1()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        published               TIMESTAMP NULL,
        query                   TEXT NULL,
        base_layers             TEXT NULL,
        base_layer              VARCHAR(100) NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
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
        owner_id                INT(10) UNSIGNED NOT NULL DEFAULT 0,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NULL,
        is_wms                  TINYINT(1) NULL,
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
        wms_address             VARCHAR(100) NULL,
        wms_layers              VARCHAR(100) NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),
        INDEX                   (item_id, exhibit_id),
        FULLTEXT KEY            (title, body, slug, tags, widgets),
        SPATIAL INDEX           (coverage)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}


/**
 * 2.0-alpha2 schema.
 */
function nl_schema20alpha2()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        user_id                 INT(10) UNSIGNED NOT NULL DEFAULT 0,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        query                   TEXT NULL,
        base_layers             TEXT NULL,
        base_layer              VARCHAR(100) NULL,
        widgets                 TEXT NULL,
        title                   TEXT NULL,
        slug                    VARCHAR(100) NOT NULL,
        narrative               LONGTEXT NULL,
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
        user_id                 INT(10) UNSIGNED NOT NULL DEFAULT 0,
        item_id                 INT(10) UNSIGNED NULL,
        exhibit_id              INT(10) UNSIGNED NULL,
        added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                TIMESTAMP NULL,
        is_coverage             TINYINT(1) NULL,
        is_wms                  TINYINT(1) NULL,
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
        wms_address             VARCHAR(100) NULL,
        wms_layers              VARCHAR(100) NULL,
        min_zoom                INT(10) UNSIGNED NULL,
        max_zoom                INT(10) UNSIGNED NULL,
        map_zoom                INT(10) UNSIGNED NULL,
        map_focus               VARCHAR(100) NULL,

        PRIMARY KEY             (id),
        INDEX                   (item_id, exhibit_id),
        FULLTEXT KEY            (title, body),
        SPATIAL INDEX           (coverage)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

}


/**
 * 1.1.3 schema.
 */
function nl_schema113()
{

    $db = get_db();

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_exhibits (

        id                          int(10) unsigned not null auto_increment,
        added                       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        modified                    TIMESTAMP NULL,
        name                        tinytext collate utf8_unicode_ci,
        description                 TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
        slug                        varchar(100) NOT NULL,
        public                      tinyint(1) NOT NULL,
        query                       TEXT COLLATE utf8_unicode_ci NULL,
        image_id                    int(10) unsigned NULL,
        top_element                 ENUM('map', 'timeline') DEFAULT 'map',
        items_h_pos                 ENUM('right', 'left') DEFAULT 'right',
        items_v_pos                 ENUM('top', 'bottom') DEFAULT 'bottom',
        items_height                ENUM('full', 'partial') DEFAULT 'partial',
        is_map                      tinyint(1) NOT NULL,
        is_timeline                 tinyint(1) NOT NULL,
        is_items                    tinyint(1) NOT NULL,
        is_context_band             tinyint(1) NOT NULL,
        h_percent                   int(10) unsigned NULL,
        v_percent                   int(10) unsigned NULL,
        default_map_bounds          varchar(100) NULL,
        default_map_zoom            int(10) unsigned NULL,
        default_focus_date          varchar(100) NULL,
        default_timeline_zoom       int(10) unsigned NULL,
        default_vector_color        tinytext COLLATE utf8_unicode_ci NULL,
        default_stroke_color        tinytext COLLATE utf8_unicode_ci NULL,
        default_highlight_color     tinytext COLLATE utf8_unicode_ci NULL,
        default_vector_opacity      int(10) unsigned NULL,
        default_select_opacity      int(10) unsigned NULL,
        default_stroke_opacity      int(10) unsigned NULL,
        default_graphic_opacity     int(10) unsigned NULL,
        default_stroke_width        int(10) unsigned NULL,
        default_point_radius        int(10) unsigned NULL,
        default_base_layer          int(10) unsigned NULL,
        default_context_band_unit   ENUM('hour', 'day', 'week', 'month', 'year', 'decade', 'century') DEFAULT 'decade',
        default_context_band_height int(10) unsigned NULL,
        creator_id                  int(10) unsigned NOT NULL,

        PRIMARY KEY (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_records (

        id                          int(10) unsigned not null auto_increment,
        item_id                     int(10) unsigned NULL,
        use_dc_metadata             tinyint(1) NULL,
        exhibit_id                  int(10) unsigned NULL,
        parent_record_id            int(10) unsigned NULL,
        show_bubble                 tinyint(1) NULL,
        title                       mediumtext COLLATE utf8_unicode_ci NULL,
        slug                        varchar(100) NULL,
        description                 mediumtext COLLATE utf8_unicode_ci NULL,
        start_date                  tinytext COLLATE utf8_unicode_ci NULL,
        end_date                    tinytext COLLATE utf8_unicode_ci NULL,
        start_visible_date          tinytext COLLATE utf8_unicode_ci NULL,
        end_visible_date            tinytext COLLATE utf8_unicode_ci NULL,
        geocoverage                 mediumtext COLLATE utf8_unicode_ci NULL,
        left_percent                int(10) unsigned NULL,
        right_percent               int(10) unsigned NULL,
        vector_color                tinytext COLLATE utf8_unicode_ci NULL,
        stroke_color                tinytext COLLATE utf8_unicode_ci NULL,
        highlight_color             tinytext COLLATE utf8_unicode_ci NULL,
        vector_opacity              int(10) unsigned NULL,
        select_opacity              int(10) unsigned NULL,
        stroke_opacity              int(10) unsigned NULL,
        graphic_opacity             int(10) unsigned NULL,
        stroke_width                int(10) unsigned NULL,
        point_radius                int(10) unsigned NULL,
        point_image                 tinytext COLLATE utf8_unicode_ci NULL,
        space_active                tinyint(1) NULL,
        time_active                 tinyint(1) NULL,
        items_active                tinyint(1) NULL,
        display_order               int(10) unsigned NULL,
        map_bounds                  varchar(100) NULL,
        map_zoom                    int(10) unsigned NULL,

        PRIMARY KEY (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    $db->query(<<<SQL

    CREATE TABLE IF NOT EXISTS {$db->prefix}neatline_base_layers (

        id                          int(10) unsigned not null auto_increment,
        name                        tinytext COLLATE utf8_unicode_ci NULL,

        PRIMARY KEY (id)

    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    $layers = array(
        'OpenStreetMap',
        'Google Physical',
        'Google Streets',
        'Google Hybrid',
        'Google Satellite',
        'Stamen Watercolor',
        'Stamen Toner',
        'Stamen Terrain'
    );

    $table = $db->getTable('BaseLayers');

    // Install default layers.
    foreach ($layers as $layer) {
        $table->insert(array('name' => $layer));
    }

    $styles = array(
        'vector_color'        => '#196aff',
        'stroke_color'        => '#000000',
        'highlight_color'     => '#ff9600',
        'vector_opacity'      => '30',
        'select_opacity'      => '40',
        'stroke_opacity'      => '100',
        'graphic_opacity'     => '80',
        'stroke_width'        => '3',
        'point_radius'        => '6',
        'h_percent'           => '24',
        'v_percent'           => '84',
        'timeline_zoom'       => '15',
        'context_band_unit'   => 'decade',
        'context_band_height' => '35'
    );

    // Install default styles.
    foreach ($styles as $style => $value) {
      set_option($style, $value);
    }

}
