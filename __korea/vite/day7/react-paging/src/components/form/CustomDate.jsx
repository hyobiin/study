import React, { useRef } from 'react';
import Input from './Input';
import { useFormik } from 'formik';

const CustomDate = () => {
    const restCompanyForm = useFormik({
		initialValues: {
            startAtMonth: '',
			startAtDay: '',
			endAtMonth: '',
			endAtDay: '',
        }
    });
    const startDayRef = useRef();
	const endMonthRef = useRef();
	const endDayRef = useRef();
	const handleInpDateChange = (e, type, max, setFieldValue, nextRef = null) => {
		let value = e.target.value.replace(/\D/g, '');
		const intValue = parseInt(value) || 0;

		if(type === 'month'){
			if(intValue > 1 && value.length === 1){
				value = '0' + value;
			}
		}

		if(type === 'day') {
			if (intValue > 3 && value.length === 1) {
				value = '0' + value;
			}
		}

		if (intValue > max){
			value = max;
		}

		restCompanyForm.setFieldValue(setFieldValue, value);
		if (value.length === 2 || intValue > max) {
			if(nextRef && nextRef.current){
				nextRef.current.focus(); // 포커스 이동
			}else if(nextRef === 'last'){
				e.target.blur();
			}
		}
	}
	const handleInpDateBlur = (e, setFieldValue) => {
		let value = e.target.value.replace(/\D/g, '');

		if (value && value.length < 2) {
			restCompanyForm.setFieldValue(setFieldValue, value.padStart(2, '0'));
		}
	}

    return(
        <div className='custom_date_box'>
            <Input
                name='startAtMonth'
                type='number'
                placeholder="MM"
                min={1}
                value={restCompanyForm.values.startAtMonth || ''}
                onChange={(e) => handleInpDateChange(e, 'month', 12, 'startAtMonth', startDayRef)}
                onBlur={(e) => handleInpDateBlur(e, 'startAtMonth')}
            />
            <Input
                name='startAtDay'
                type='number'
                placeholder="DD"
                min={1}
                value={restCompanyForm.values.startAtDay || ''}
                onChange={(e) => handleInpDateChange(e, 'day', 31, 'startAtDay', endMonthRef)}
                onBlur={(e) => handleInpDateBlur(e, 'startAtDay')}
                ref={startDayRef}
            />
            ~
            <Input
                name='endAtMonth'
                type='number'
                placeholder="MM"
                min={1}
                value={restCompanyForm.values.endAtMonth || ''}
                onChange={(e) => handleInpDateChange(e, 'month', 12, 'endAtMonth', endDayRef)}
                onBlur={(e) => handleInpDateBlur(e, 'endAtMonth')}
                ref={endMonthRef}
            />
            <Input
                name='endAtDay'
                type='number'
                placeholder="DD"
                min={1}
                value={restCompanyForm.values.endAtDay || ''}
                onChange={(e) => handleInpDateChange(e, 'day', 31, 'endAtDay', 'last')}
                onBlur={(e) => handleInpDateBlur(e, 'endAtDay')}
                ref={endDayRef}
            />
        </div>
    )
}

export default CustomDate;