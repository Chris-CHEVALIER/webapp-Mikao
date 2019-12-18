import InputFormItem from 'components/form-items/InputFormItem.jsx';
import TextAreaFormItem from 'components/form-items/TextAreaFormItem.jsx';
import InputNumberFormItem from 'components/form-items/InputNumberFormItem.jsx';
import CheckboxFormItem from 'components/form-items/CheckboxFormItem.jsx';
import SelectFormItem from 'components/form-items/SelectFormItem.jsx';
import DatePickerFormItem from 'components/form-items/DatePickerFormItem.jsx';
import LinkedDatePickerFormItem from 'components/form-items/LinkedDatePickerFormItem.jsx';
import RangePickerFormItem from 'components/form-items/RangePickerFormItem.jsx';
import RadioGroupFormItem from 'components/form-items/RadioGroupFormItem.jsx';
import TimePickerFormItem from 'components/form-items/TimePickerFormItem.jsx';

export default {
    Input: InputFormItem,
    TextArea: TextAreaFormItem,
    Checkbox: CheckboxFormItem,
    Select: SelectFormItem,
    DatePicker: DatePickerFormItem,
    RangePicker: RangePickerFormItem,
    LinkedDatePicker: LinkedDatePickerFormItem,
    InputNumber: InputNumberFormItem,
    RadioGroup: RadioGroupFormItem,
    TimePicker: TimePickerFormItem,
};

const InputItem = InputFormItem;
const TextAreaItem = TextAreaFormItem;
const InputNumberItem = InputNumberFormItem;
const CheckboxItem = CheckboxFormItem;
const SelectItem = SelectFormItem;
const DatePickerItem = DatePickerFormItem;
const RangePickerItem = RangePickerFormItem;
const LinkedDatePickerItem = LinkedDatePickerFormItem;
const RadioGroupItem = RadioGroupFormItem;
const TimePickerItem = TimePickerFormItem;

export { InputItem, TextAreaItem, InputNumberItem, CheckboxItem, SelectItem, DatePickerItem, LinkedDatePickerItem, RangePickerItem, RadioGroupItem, TimePickerItem };
