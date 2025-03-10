import { toast } from "react-toastify";
import shp from "shpjs";

interface ShapeResult {
  hasError: boolean;
  errorMessage: string | null;
  data: any[] | null;
}

const extractShapes = async (files: FileList): Promise<ShapeResult> => {
  const result: ShapeResult = {
    hasError: false,
    errorMessage: null,
    data: null,
  };

  const _formatShape = (_data: any): any[] | null => {
    try {
      return _data.features;
    } catch {
      toast.error("Formato de arquivo inválido.");
      return null;
    }
  };

  const _parseFile = async (_file: File): Promise<ShapeResult> => {
    const _result: ShapeResult = {
      hasError: false,
      errorMessage: null,
      data: null,
    };

    const _data = await _file
      .arrayBuffer()
      .then((_buffer: ArrayBuffer) => shp(_buffer))
      .catch((_err: Error) => {
        console.error(_err);
        _result.hasError = true;
        _result.errorMessage = "IMPORT_UNRECOGNISED_FILE";
        return null;
      });

    _result.data = _formatShape(_data);

    if (_result.hasError) return _result;

    if (!_result.data || _result.data.length < 1) {
      _result.hasError = true;
      _result.errorMessage = "EXTRACT_FILE_EMPTY";
    }

    return _result;
  };

  result.data = await Promise.all(
    Array.prototype.map.call(files, _parseFile)
  ).catch((err: Error) => {
    console.error(err);
    result.hasError = true;
    result.errorMessage = "Extract went wrong";
    return null;
  });

  if (result.hasError) return result;

  if (!result.data || result.data.length < 1) {
    result.hasError = true;
    result.errorMessage = "IMPORT_SHAPE_EMPTY";
  }

  if (result.data && result.data.length > 0 && result.data[0].data) {
    return result.data[0].data;
  }

  return result;
};

export { extractShapes };
