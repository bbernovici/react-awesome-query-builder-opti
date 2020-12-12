import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import {useOnPropsChanged, mapListValues, calcTextWidth, SELECT_WIDTH_OFFSET_RIGHT} from "../../../../utils/stuff";
const Option = Select.Option;

export default class MultiSelectWidget extends PureComponent {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    value: PropTypes.array,
    field: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    customProps: PropTypes.object,
    fieldDefinition: PropTypes.object,
    readonly: PropTypes.bool,
    // from fieldSettings:
    listValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    allowCustomValues: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {buildOptions: false}
    useOnPropsChanged(this);
    this.setOptions(props)
    this.onPropsChanged(props);
  }

  onPropsChanged (props) {
  
  }

  setOptions (props) {
    const {listValues} = props;

    let optionsMaxWidth = 0;
    // mapListValues(listValues, ({title, value}) => {
    //   optionsMaxWidth = Math.max(optionsMaxWidth, calcTextWidth(title, null));
    // });
    this.optionsMaxWidth = optionsMaxWidth;

    this.options = mapListValues(listValues, ({title, value}) => {
      return (<Option key={value} value={value}>{title}</Option>);
    });
  }

  handleChange = (val) => {
    if (val && !val.length) {
      val = undefined; //not allow []
    } 
    this.props.setValue(val);
  }

  handleDropdownOpen = (open) => {
    if (open) {
      this.setState(state => ({
        buildOptions: true
      }));
    } else {
      this.setState(state => ({
        buildOptions: false
      }));
    }
  }

  filterOption = (input, option) => {
    const dataForFilter = option.children || option.value;
    return dataForFilter.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const {config, placeholder, allowCustomValues, customProps, value, readonly} = this.props;
    const {renderSize} = config.settings;
    const placeholderWidth = calcTextWidth(placeholder);
    const _value = value && value.length ? value : undefined;
    const width = _value ? null : placeholderWidth + SELECT_WIDTH_OFFSET_RIGHT;
    const dropdownWidth = this.optionsMaxWidth + SELECT_WIDTH_OFFSET_RIGHT;
    
    return (
      <Select
        disabled={readonly}
        mode={allowCustomValues ? "tags" : "multiple"}
        style={{
          minWidth: width+200,
          width: width,
        }}
        dropdownStyle={{
          width: dropdownWidth,
        }}
        onDropdownVisibleChange={this.handleDropdownOpen}
        key={"widget-multiselect"}
        placeholder={placeholder}
        size={renderSize}
        value={_value}
        onChange={this.handleChange}
        filterOption={this.filterOption}
        {...customProps}
      >{this.state.buildOptions && this.options}
      </Select>
    );
  } 
}
