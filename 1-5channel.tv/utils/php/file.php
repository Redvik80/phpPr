<?
    $imagesDirRoot = "../../files/images/";

    function getExtension($mimeType) {
        $extensions = [
            'image/jpeg' => '.jpeg',
            'text/png' => '.png'
        ];
        return $extensions[$mimeType];
    }

    function saveImage($imageDataUrl) {
        global $imagesDirRoot;
        $imgArr = explode(",", $imageDataUrl, 2);
        $fileData = base64_decode($imgArr[1]);
        $fileExt = getExtension(explode(";base64", explode("data:", $imgArr[0], 2)[1], 2)[0]);
        $fileName = microtime() . uniqid() . $fileExt;
        file_put_contents($imagesDirRoot . $fileName, $fileData);
        return $fileName;
    }

    function delImage($fileName) {
        global $imagesDirRoot;
        if ($fileName && file_exists($imagesDirRoot . $fileName)) {
            unlink($imagesDirRoot . $fileName);
        }
    }
?>