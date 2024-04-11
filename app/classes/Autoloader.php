<?php

namespace mab;

/**
*
* * *     *       *    *     *   * * * *   *     *   * * * *
*     *     *   *      * *   *   *         *     *   *
* * *         *        *  *  *   * * *     *     *   * * *
*     *     *          *   * *   *         *     *   *
* * *     *            *     *   * * * *   * * * *   * * * * 
*
*
* Application autoloader
*
* @created: 
* @author: NEUE
* @link: https://agenceneue.com
* @version: 1.0
* @updates: -
* 
**/

//require_once 'CoreMainClass.php'; /* the autoloading is not loaded so we need to call the extended class manualy */

class Autoloader
{

    static $_trying_paths = [
        _CLASSES_,
        _HELPERS_
    ];

    public static function addTryingPath(string $new_path) {

        // echo $new_path;

        self::$_trying_paths[] = $new_path;
    }

    static function mAutoLoad($class_name) {

        $init_class_name = $class_name;

        // echo "<pre>class name: ".print_r($class_name, true)."</pre>";

        $class_name = substr(strrchr($class_name, "\\"), 1);

        if (empty($class_name)) {
            $class_name = $init_class_name;
        }

        // echo "<pre>class name after : ".print_r($class_name, true)."</pre>";

        foreach (self::$_trying_paths as $key => $path) {
            $file_path = $path.$class_name.".php";
            if (!file_exists($file_path)) continue;
            require_once $file_path;
            break;
        }
    }

    public static function register() {
        spl_autoload_register(array(__CLASS__, 'mAutoLoad'));
    }

}