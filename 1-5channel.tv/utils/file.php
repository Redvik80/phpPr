<?
    $imagesDirRoot = "../../files/images/";
    $videosDirRoot = "../../files/videos/";

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
?>