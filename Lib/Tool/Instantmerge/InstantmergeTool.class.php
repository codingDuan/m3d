<?php
/**
 * Created by JetBrains PhpStorm. 合图工具类
 * Dependency: CSSParserTool
 * User: zoujiawei
 * Date: 13-11-11
 * Time: 下午5:27
 * To change this template use File | Settings | File Templates.
 */

defined('INSTANTMERGE_PATH') or define('INSTANTMERGE_PATH', dirname(__FILE__).'/');
// 加载编译配置
C(include INSTANTMERGE_PATH . 'config.php');

require_once('MergeConfig/MergeConfigGenerator.class.php');
require_once('MergeConfig/MergeConfigLoader.class.php');
require_once('MergeConfig/MergeConfigWriter.class.php');
require_once('MergeImage/typedef.php');
require_once('MergeImage/Image.class.php');
require_once('MergeImage/Layout.class.php');
require_once('MergeImage/Sprite.class.php');

class InstantmergeTool extends Tool {
    // 合图开始
    public function run() {
        $files = get_files_by_type(C('SRC_SRC_PATH'), 'css');
        $generator = new MergeConfigGenerator($files);
        $generator->generate();
        $writer = new MergeConfigWriter(C('M3D_IMERGE_PATH'));
        $writer->writeImageConfig($generator->getConfig());

        // 更新大图
        $this->updateSprite();
    }

    public function updateSprite() {
        $types = $this->getLoader()->getTypes();
        $sprite = $this->getDraw();
        foreach ($types as $type) {
            $sprite->draw($type);
        }
    }

    public function getLoader() {
        static $loader;
        return $loader ? $loader : new MergeConfigLoader(C('M3D_IMERGE_PATH'));
    }

    public function getWriter() {
        static $writer;
        return $writer ? $writer : new MergeConfigWriter(C('M3D_IMERGE_PATH'));
    }

    public function getDraw() {
        static $draw;
        return $draw ? $draw : new Sprite(C('M3D_IMERGE_PATH'), C('SRC_SRC_PATH'));
    }
}