<?
    $imagesDirRoot = __DIR__ . "/../files/images/";
    $videosDirRoot = __DIR__ . "/../files/videos/";

    $imagesSrcRoot = "/files/images/";
    $videosSrcRoot = "/files/videos/";

    function saveFile($dataUrl, $extension, $dir) {
        if (!$dataUrl) return "";
        $imgArr = explode(",", $dataUrl, 2);
        $fileData = base64_decode($imgArr[1]);
        $fileName = uniqid() . "." . $extension;
        while (file_exists($dir . $fileName)) {
            $fileName = uniqid() . "." . $extension;
        }
        file_put_contents($dir . $fileName, $fileData);
        return $fileName;
    }

    function delFile($fileName, $dir) {
        if ($fileName && file_exists($dir . $fileName)) {
            unlink($dir . $fileName);
        }
    }

    function getImgSrc($fileName) {
        global $imagesDirRoot, $imagesSrcRoot;
        if ($fileName && file_exists($imagesDirRoot . $fileName)) return $imagesSrcRoot . $fileName;
        return $imagesSrcRoot . "noImage.png";
    }
?>