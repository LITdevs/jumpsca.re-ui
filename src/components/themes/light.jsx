import '../../css/themes/light.css';
import {createUseDisableImportedStyles} from "./useDisableImportedStyles";

const useDisableImportedStyles = createUseDisableImportedStyles()

const Theme = () => {
	useDisableImportedStyles();
	return null;
}

export default Theme;