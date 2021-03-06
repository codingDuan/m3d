<?php
/**
 * 为了满足音乐人局刷的插件，主要生成一些用于局刷的文件
 */

on('process_start', 'IframeRefresh');
on('export_map_end', 'IframeRefreshPlugin::handleMap');
on('write_build_file_start', 'IframeRefreshPlugin::addContent');
on('process_js_start', 'IframeRefreshImport');
on('process_end', 'IframeRefreshPlugin::ci');

class IframeRefreshPlugin extends Plugin {
    protected $options = array(
        'ifresh.is_gen' => false, // 是否生成map
        'ifresh.path' => '{src.m3d_map_path}',
    );

    public function run($params) {
        if (!C('IFRESH.IS_GEN')) {
            off('export_map_end', 'IframeRefreshPlugin::handleMap');
            off('write_build_file_start', 'IframeRefreshPlugin::addContent');
            off('process_js_start', 'IframeRefreshImport');
        }
    }

    public static function handleMap($params) {
        $tool = $params[1];
        $type = $params[2];
        $map = $tool->getMap($type);
        $map = self::genMap($map, $type);
        self::exportMaps($map, $type);
    }

    public static function addContent($params) {
        $processor = $params[1];
        if ($processor instanceof CssPreprocess) {
            $uid = $processor->getFileUid();
            $contents = $processor->getContents();
            $processor->setContents($contents.'#m3d_'.$uid.'{height:9527px}');
        }
    }

    public static function ci() {
        shell_exec_ensure(C('SVN').' add '.C('IFRESH.PATH').' --force', false);
        shell_exec_ensure(C('SVN').' ci "'.C('IFRESH.PATH').'" -m "commit by M3D::IframeRefreshPlugin"', false);
    }

    private static function genMap($map, $type) {
        $ret = array(
            'build' => array(),
            'static' => array(),
            'one_on_one' => array()
        );
        foreach ($map as $key => $value) {
            $uid = pathinfo($value, PATHINFO_FILENAME);
            $ret['build'][$key] = array(
                'uid' => $uid
            );
            $ret['static'][$uid] = array(
                'path' => $value,
                'from' => $key,
                'type' => $type
            );
            $ret['one_on_one'][$key] = array(
                'uid' => $uid
            );
        }
        return $ret;
    }

    private static function exportMaps($map, $type) {
        $maps = '<?php '.PHP_EOL.'$'.$type.'_build_maps = ';
        $maps .= var_export($map['build'], true);
        $maps .= ';'.PHP_EOL;

        $maps .= '$'.$type.'_static_maps = ';
        $maps .= var_export($map['static'], true);
        $maps .= ';'.PHP_EOL;

        $maps .= '$'.$type.'_1on1_maps = ';
        $maps .= var_export($map['one_on_one'], true);
        $maps .= ';';

        // 格式化，满足规范
        $maps = str_replace(array("  ", 'NULL'), array("    ", 'null'), $maps);

        contents_to_file(C('IFRESH.PATH').'/'.$type.'_build_maps.php', $maps);
    }
}

class IframeRefreshImportPlugin extends Plugin {
    private $processor = null;

    public function run($params) {
        $this->processor = $params[1];
        $contents = preg_replace_callback(
            '/(?<!\/)\$this->import\([\'\"]([^\'\"\)]*)[\'\"]\);/',
            array($this, 'handle'),
            str_replace('<?php', '', $this->processor->getContents())
        );
        $this->processor->setContents($contents);
    }

    private function handle($matches) {
        $path = Tool::getActualPath($matches[1]);
        $processor = new JsPreprocess($this->processor->getMap());
        $processor->setFile(C('SRC.SRC_PATH').$path);
        $processor->process();

        trigger('js_import', $this->processor, $processor);

        return $processor->getContents();
    }
}