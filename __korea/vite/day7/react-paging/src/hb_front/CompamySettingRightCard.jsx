import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef, useCallback } from 'react';
import moment from 'moment';
import Card, { CardBody, CardTabItem, CardHeader, CardLabel, CardTitle, CardActions, CardSubTitle, CardFooterRight, CardFooterLeft } from '../../../../components/bootstrap/Card';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Input from '../../../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import ListGroup from '../../../../components/bootstrap/ListGroup';
import Badge from '../../../../components/bootstrap/Badge';
import Dropdown, { DropdownMenu, DropdownToggle, DropdownItem } from '../../../../components/bootstrap/Dropdown';
import Option from '../../../../components/bootstrap/Option';
import SortableTree from '@nosferatu500/react-sortable-tree';
import Tooltips from '../../../../components/bootstrap/Tooltips';
import Icon from '../../../../components/icon/Icon';
import { useMst } from '../../../../models';
import { useTranslation } from 'react-i18next';
import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import AuthService from '../../../../services/AuthService';
import CompanyService from '../../../../services/CompanyService';
import PositionService from '../../../../services/PositionService';
import DeadlineItem from './DeadlineItem';
import DeadlineDetailItem from './DeadlineDetailItem';
import RankService from '../../../../services/RankService';
import DeadlineService from '../../../../services/DeadlineService';
import showNotification from '../../../../components/extras/showNotification';
import { Calendar as DatePicker } from 'react-date-range';
import { arrayMove, sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import Popovers from '../../../../components/bootstrap/Popovers';
import PositionItem from './PositionItem';
import RankItem from './RankItem';
import HolyItem from './HolyItem';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import OffCanvas, { OffCanvasBody, OffCanvasHeader, OffCanvasTitle } from '../../../../components/bootstrap/OffCanvas';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Label from '../../../../components/bootstrap/forms/Label';
import Select from '../../../../components/bootstrap/forms/Select';
import { useFormik } from 'formik';
import RestdayService from '../../../../services/RestdayService';
import { CartDash } from '../../../../components/icon/bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Checks from '../../../../components/bootstrap/forms/Checks';
import AddDeadlineModal from "./AddDeadlineModal";
import DupPeriodNoticeModal from "./DupPeriodNoticeModal";
import WorkDeadlineUserListModal from "./WorkDeadlineUserListModal";
import VacationPolicyConfirmModal from '../VacationPolicyConfirmModal';
import FileUpload from '../../../common/UploadFile';
import CustomSelectChk from '../../../../components/bootstrap/forms/CustomSelectChk';
import WorkTypeService from '../../../../services/WorkTypeService';
import RestSettingModal from './RestSettingModal';
import { useEffectOnce } from 'react-use';
import DepartmentService from '../../../../services/DepartmentService';

/******************************************************************
 * 파일명 : frontend2\src\pages\AuthMenu\Company\components\CompamySettingRightCard.js
 * 메뉴 : 
 * 설명 : 관리자모드 > 회사설정 > 직책/직위/휴일/휴가/마감관리/근무유형
 ******************************************************************/

const CompamySettingRightCard = forwardRef((props, ref) => {
	//const CompamySettingRightCard = props => {
	const { t } = useTranslation();
	const { company, user } = useMst();
	const navigate = useNavigate();
	const [deleteRankUnit, setDeleteRankUnit] = useState(null);
	const [holidayList, setHolidayList] = useState([]);
	const [vacationList, setVacationList] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const [positionList, setPositionList] = useState([]);
	const [updateRankUnit, setUpdateRankUnit] = useState(null);
	const [deadlineList, setDeadlineList] = useState([]);
	const [originDeadlineDetailList, setOriginDeadlineDetailList] = useState([]);
	const [deadlineDetailList, setDeadlineDetailList] = useState([]);
	const [workTypeList, setWorkTypeList] = useState([]);
	const [selectedDeadline, setSelectedDeadline] = useState(null);
	const [deadlineNotComplete, setDeadlineNotComplete] = useState(null);
	const [deadlineDetailNotConfirmed, setDeadlineDetailNotConfirmed] = useState(null);
	const [array, setArray] = useState(props.array ? props.array : ['직책', '직위', '휴일', '휴가', '마감 관리', '개인별 마감 현황']);
	const nationalHoliday = [t('신정'), t('설날'), t('3.1절'), t('부처님 오신 날'), t('어린이날'), t('현충일'), t('광복절'), t('추석연휴'), t('개천절'), t('한글날'), t('크리스마스')];
	const [restMessages, setRestMessages] = useState([]);
	const [isDisabled, setIsDisabled] = useState(false);
	const [deadlineForUpdate, setDeadlineForUpdate] = useState();
	const [result, setResult] = useState(null);
	const inputRef1 = useRef(); //이름
	const inputRef2 = useRef(); //사번
	const inputRef3 = useRef(); //부서
	const inputRef4 = useRef(); //직위
	const addDeadlineRef = useRef();
	const keywordData = [
		{ value: 1, label: t('workDeadline.all') },
		{ value: 2, label: t('workDeadline.confirmed')  },
		{ value: 3, label: t('workDeadline.unconfirmed') },
	];
	const [selectedOption, setSelectedOption] = useState(0);

	const [restMessageSettingOpen, setRestMessageSettingOpen] = useState(false);

	const year = (new Date().getFullYear() + 1).toString(); // 내년
	
	const [isModalOpen3, setIsModalOpen3] = useState(false); 
	const [isModalOpen2, setIsModalOpen2] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
	const [dupPeriodModalOpen, setDupPeriodModalOpen] = useState(false);
	const [selectUserModalOpen, setSelectUserModalOpen] = useState(false);
	const [restAccrualTransferMaxYear, setRestAccrualTransferMaxYear] = useState(year);
	const [restAccrualTransferMaxDate, setRestAccrualTransferMaxDate] = useState('12월31일');
	const [isOpenVacationPolicyConfirmModal, setIsOpenVacationPolicyConfirmModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// const [icoFilePreview, setIcoFilePreview] = useState(null); // 파일 미리보기
	// const [icoFileUpload, setIcoFileUpload] = useState(null); // 파일 업로드 
	const [vacationName, setVacationName] = useState(false);

	// 근무유형 카드 사용여부
	const [workTypeStatus, setWorkTypeStatus] = useState({});

	// 이월연차 기준 설정 모달
	const [restScopeModalOpen, setRestScopeModalOpen] = useState(false);
	const [restDepartments, setRestDepartments] = useState([]);
	const [originUserData, setOriginUserData] = useState([]);
	const [userTotalCount, setUserTotalCount] = useState(0)
	const [departmentTree, setDepartmentTree] = useState([]);

	useEffect(() => {
		if (workTypeList?.length > 0) {
			const statusMap = workTypeList.reduce((acc, work) => {
				acc[work.abntdWorkTypCd] = work.abntdWorkTypStatus ?? true;
				return acc;
			}, {});
			setWorkTypeStatus(statusMap);
		}
	}, [workTypeList]);

	const deleteHoliday = async (holiday) => {
		const id = holiday.id;
		const companyId = company.id;

		await CompanyService.deleteHoliday(companyId, id).then((res) => {
			showNotification(t('휴일 삭제'), t('휴일 삭제 완료'), 'success');
			refresh();
		});
	};

	const deleteRank = async (rank) => {
		await RankService.removeRank(rank).then((response) => {
			if (response.code == 200) {
				showNotification(t('직위 삭제'), t('직위를 삭제 하였습니다'), 'success');
				setDeleteRankUnit(null);
			}
		});
		await RankService.getSortTreeRank(company.id).then((response) => {
			const newArray = response.data.filter((d) => d.name != '');
			setTreeData(newArray);
		});
	};

	const deletePosition = async (position) => {
		const response = await PositionService.deletePosition(company.id, position.id)
		if (response.code == 200) {
			showNotification(t('직책 삭제'), t('직책을 삭제 하였습니다'), 'success');
			refresh();
		}
	};

	useImperativeHandle(ref, () => ({
		refresh() {
			refresh();
		},
	}));

	const refresh = async () => {
		switch (array[0]) {
			case '휴가':
				CompanyService.getRestType(company.get.id).then((res) => {
					setVacationList(res.data);
				});
				break;
			case '휴일':
				CompanyService.newList(company.id).then((response) => {
					setHolidayList(response.data);
				});
				break;
			case '직위':
				RankService.getSortTreeRank(company.id).then((response) => {
					const newArray = response.data.filter((d) => d.name != '');
					setTreeData(newArray);
				});
				break;
			case '직책':
				PositionService.getPosition(company.id).then((response) => {
					setPositionList(response.data?.filter((position) => position.name !== '') || []);
				});
				break;
			case '마감 관리':
				DeadlineService.list(company.id).then((response) => {
					setDeadlineList(response.data);
				});
				break;
			 case '근무유형':
				 WorkTypeService.list(company.get.id).then((workType) => {
					 setWorkTypeList(workType.data);
				 });
				 break;
		}
		// await Promise.all([
		// ]);
	};

	useEffect(() => {
		refresh();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!isModalOpen) {
			customRestForm.resetForm();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen]);

	useEffect(() => {
		if (!selectUserModalOpen && deadlineForUpdate)
			setDeadlineForUpdate(undefined)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectUserModalOpen])

	const onSortEnd = async ({ oldIndex, newIndex }) => {
		//treeData
 
		const newTreeData = arrayMoveImmutable(treeData, oldIndex, newIndex);
		await RankService.updateRankTree({
			ranks: newTreeData,
		})
			.then(async (res) => {
				await RankService.getSortTreeRank(company.id).then((response) => {
					const newArray = response.data.filter((d) => d.name != '');
					setTreeData(newArray);
					showNotification(t('companySetting.rankMgt'), t('companySetting.message.transferCompleted'), 'success');
				});
			})
			.catch((err) => {});
	};

	const SortableItem = sortableElement(({ value, index }) => (
		// eslint-disable-next-line react/jsx-props-no-spreading
		<RankItem rank={value} {...props} refresh={refresh} deleteRank={deleteRank} />
	));

	const SortableContainer = sortableContainer(({ children }) => {
		return (
			<div className='table-responsive'>
				<table
					className='table table-sm user-select-none table-hover'
					style={{
						borderSpacing: 0,
						borderCollapse: 'separate',
					}}>
					<thead>
						<tr>
							<th
								className='table-sticky bg-white py-4 align-middle border-active-bottom'
								scope='col'
								width='50px'
								style={{
									minWidth: 50,
									width: 50,
									top: 0,
									zIndex: 3,
								}}>
								&nbsp;
							</th>
							<th
								className='table-sticky bg-white py-4 align-middle border-active-bottom'
								scope='col'
								width='150px'
								style={{
									minWidth: 150,
									width: 150,
									top: 0,
									zIndex: 3,
								}}>
								{t('직위 순위')}
							</th>
							<th
								className='table-sticky bg-white py-4 align-middle border-active-bottom'
								scope='col'
								width='30%'
								style={{
									top: 0,
									zIndex: 3,
								}}>
								{t('직위명')}
							</th>
							<th
								className='table-sticky bg-white py-4 align-middle border-active-bottom'
								scope='col'
								width=''
								style={{
									top: 0,
									zIndex: 3,
								}}>
								-
							</th>
						</tr>
					</thead>
					<tbody className=''>{children}</tbody>
				</table>
			</div>
		);
	});

	//******************************************************************************************** */
	// 휴가 정책
	const restCompanyForm = useFormik({
		initialValues: {
			companyId: company.get.id,
			restType: company.get.restType || false,
			restDate: company.get.restDate || '01-01',

			restOptionMonth: company.get.restOptionMonth || '',
			// restDestoryMonth: company.get.restDestoryMonth || true,
			//restGraceMonth: company.get.restGraceMonth || 0, // 유예기간

			restOptionYear: company.get.restOptionYear || 0,
			restRoundYear: company.get.restRoundYear || 'ROUND',
			restDestoryYear: company.get.restDestoryYear || true,
			restGraceYear: null, // 유예기간 // [hb] 250415 연차 소멸 연차 삭제로 null 값으로 변경

			restUseUnit: company.get.restUseUnit || 'HALF',
			restPromote: company.get.restPromote || false,
			restMethod: company.get.restMethod || 'ALL', // 값: ALL, DAY, TIME

			restAccrualTransfer : company.get.restAccrualTransfer || false , //연차이월여부
			restAccrualTransferMax : company.get.restAccrualTransferMax || 0, // 연차적립제한갯수
			/*startAtMonth: '',
			startAtDay: '',
			endAtMonth: '',
			endAtDay: '',*/
			restAccrualTransferGrace: company.get.restAccrualTransferGrace || 0, //이월연차 사용 기한
			restAccrualTransferStart: company.get.restAccrualTransferStart, //이월연차 신청기간(FROM)
			restAccrualTransferEnd: company.get.restAccrualTransferEnd, //이월연차 신청기간(TO)
			restScope: false,
			restAccrualTransferMaxDate: company.get.restAccrualTransferMaxDate || moment(year + '1231').format('YYYY-MM-DD'), //연차 적립 제한날짜
			restNegativeAccrualMax : company.get.restNegativeAccrualMax ||   0, //연차 선사용 마이너스 연차
			restAllowNegativeAccrual: company.get.restAllowNegativeAccrual || false, // 마이너스 연차 제한갯수
			//priorityUseMax : company.get?.priorityUseMax || null, // 우선사용
			//priorityUse: company.get?.priorityUse || false,
		},
		validate: (values) => {
			const erros = {};

			return erros;
		},
		onSubmit: async (values) => {
			//
			await CompanyService.vaction(values)
				.then((res) => {
					if (res.data) {
						showNotification(t('휴가 정책 설정'), t('휴가 정책 설정이 저장되었습니다'), 'success');
						company.setData(res.data);
					}
				})
				.catch(() => {
					showNotification(t('휴가 정책 설정'), t('휴가 정책 설정 저장에 문제가 발생하였습니다'), 'danger');
				})
				.finally(() => {
					refresh();
					//setIsModalOpen(false);
				});
 
		},
	});

	// 입사자 월차
	const restOptionMonthList = [
		{ value: '', text: t('매월 개근시 1개 부여') },
		{ value: 'ALWAY', text: t('매월 1개 부여') },
		{ value: 'PREGRANT', text: t('annualLeave.monthlyAdvanceGrant') },
	];

	// 입사자 연차
	const restOptionYearList = [
		{ value: 1, text: t('첫 회계일까지 근무한 기간의 연차 부여') }, // 중도입사자 비례 지급 | 비례 15 16
		{ value: 2, text: t('입사일에 회계일까지 연차 선부여') }, //
		{ value: 3, text: t('첫 회계일에 15일 부여') }, //
	];

	// 비례연차옵션
	const restOptionRoundYearList = [
		{ value: 'ROUND', text: t('0.5 단위 올림') },
		{ value: 'FLOOR', text: t('내림') },
		{ value: 'CEIL', text: t('올림') },
	];

	const selectedRestOptionText = (value, target) => {
		return target.find((item) => item.value === value)?.text || '';
	};

	// 이월연차 신청 기간
	const startMonthRef = useRef();
	const startDayRef = useRef();
	const endMonthRef = useRef();
	const endDayRef = useRef();
	const handleInpDateChange = (e, type, max, setFieldName, nextRef = null) => {
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

		let arr, setFinalFieldName, setFinalFieldValue;
		if(setFieldName.includes('start')){
			arr = [
				(setFieldName.includes('Month')) ? value : startMonthRef.current?.value,
				(setFieldName.includes('Day')) ? value : startDayRef.current?.value
			]
			setFinalFieldName = 'restAccrualTransferStart';
		}else if(setFieldName.includes('end')){
			arr = [
				(setFieldName.includes('Month')) ? value : endMonthRef.current?.value,
				(setFieldName.includes('Day')) ? value : endDayRef.current?.value
			]
			setFinalFieldName = 'restAccrualTransferEnd';
		}
		if(setFieldName.includes('Month')){
			arr[0] = value;
		}else if(setFieldName.includes('Day')){
			arr[1] = value;
		}

		setFinalFieldValue = arr.every(val => !val) ? '' : arr.join('-');
		restCompanyForm.setFieldValue(setFinalFieldName, setFinalFieldValue);
		/*if((setFieldName.includes('start') && startMonthRef.current?.value.trim() && startDayRef.current?.value.trim())
			|| (setFieldName.includes('end') && endMonthRef.current?.value.trim() && endDayRef.current?.value.trim())){

			alert(setFinalFieldName);
			alert(setFinalFieldValue);
		}*/

		if (value.length === 2 || intValue > max) {
			if(nextRef && nextRef.current){
				nextRef.current.focus(); // 포커스 이동
			}else if(nextRef === 'last'){
				e.target.blur();
			}
		}
	}

	const handleInpDateBlur = (e, fieldName) => {
		let value = e.target.value.replace(/\D/g, '');

		if (value && value.length < 2) {
			restCompanyForm.setFieldValue(fieldName, value.padStart(2, '0'));
		}
	}

	// 맞춤 휴가 폼

	const [openOption1, setOpenOption1] = useState(false);
	const [openOption2, setOpenOption2] = useState(false);
	const isPopOverRef = useRef();
	const [isModalConfrim, setIsModalConfrim] = useState(false);

	useEffect(()=> {
		const reg = /[^0-9]/g;

		const date = restAccrualTransferMaxDate?.split('월', restAccrualTransferMaxDate.length -1);

		const onlyMonth = date[0]?.length < 2 ? ('0' + date[0]) : date[0];
		const onlyDate = date[1]?.replace(reg, '')?.length < 2 ? ('0' + date[1]?.replace(reg, '')) : date[1]?.replace(reg, '');

		restCompanyForm.setFieldValue('restAccrualTransferMaxDate', moment(restAccrualTransferMaxYear + onlyMonth + onlyDate).format('YYYY-MM-DD'));
		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[restAccrualTransferMaxYear, restAccrualTransferMaxDate])

	const getUsers = useCallback(async (years=null, size=null, page=null, filter) => {
		if (company?.get?.id) {
			let resUserList = await CompanyService.userList(company.get.id, years, size, page, filter)
				.then((res) => res?.data || {})
				.catch((error) => {
				});
			setOriginUserData(resUserList?.rows || []);
			setUserTotalCount(resUserList?.count || 0)
		}
	}, [company]);

	useEffectOnce(() => {
		Promise.all([loadGroupNDepartment(), getUsers()]);
	});

	const loadGroupNDepartment = useCallback(async () => {
		setDepartmentTree([]);
		let departmentTree = [];
		await DepartmentService.getDepartementTree(company.get.id, true).then( response => {
			if (response) {
				setDepartmentTree(response?.data);
				departmentTree = response?.data
			}
		});

		let response = await DepartmentService.getDepartement(company.get.id);
		if (response) {
			let depart = [];
			for (let r in response.data.list) {
				let userCounts = null;
		for (let department of departmentTree) {
			userCounts = findUserCountInDepartment(department, response.data.list[r].name);
			if (userCounts !== null) {
				break;
			}
		}

		depart.push({
			value: response.data.list[r].id,
			label: t(response.data.list[r].name),
			userCount: userCounts,
		});
	}
	setRestDepartments(depart);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [company]);
	const findUserCountInDepartment = (department, name) => {
		if (department.name === name) {
			return department.userCount;
		}

		if (department.children && department.children.length > 0) {
			for (let child of department.children) {
				let userCount = findUserCountInDepartment(child, name);
				if (userCount !== null) {
					return userCount;
				}
			}
		}

		return null;
	}

	//******************************************************************************************** */
	// 맞춤 휴가
	const customRestForm = useFormik({
		initialValues: {
			id: 0,
			companyId: company.get.id,
			type: 'REST_CUSTOM',
			name: null,
			memo: null,
			code: null,
			option: 'REQUEST',
			paidInfo: { paidType: 'UNPAID', paidUnit: 'd', paidValue: 0,  grantUnit: 'd', grantValue: 0},
			start: { unit: '', value: 0 },
			end: { unit: 'd', value: 0 },
			requestStart: null,
			requestEnd: null,
			dayOff: false,
			gender: null,
			document: null,
			use: null,
			isDestroyPolicy: false,
			restDestroyMonth: 0,
			restGraceMonth: 0,
			alarm: {
				restNotificationOption: false, //알람 설정 여부
				restNotificationMessage: '', //메세지 내용
				notificationTime: null, // 휴가 알림 시점 (몇일전부터..)
				notificationCycle: null, // 휴가 알림 주기 (일일 day,매주week,매달month)
			},
		},
		validateOnChange: false,
		validateOnBlur: true,
		validate: (values) => {
			const errors = {};

 

			if(// values.name === '' || 
				values.name === null){
				errors.name = t('annualLeave.vacationNameRequired');
			}

			if(values.code === '' || values.code === null){
				errors.code = t('annualLeave.vacationCodeRequired');
			}

			if (values.option == 'YEAR' || values.option == 'MONTH') {
				setOpenOption1(true);
			} else if (values.option == 'REST') {
				setOpenOption2(true);
			} else {
				setOpenOption1(false);
				setOpenOption2(false);
			}

			if (values.requestStart && values.requestEnd) {
				const startDate = moment(values.requestStart);
				const endDate = moment(values.requestEnd);
		
				if (startDate.isAfter(endDate)) {
					errors.requestStart = t('annualLeave.requestStartEror');
				}
		
				const paidValue = parseFloat(values.paidInfo.paidValue);
				const paidUnit = values.paidInfo.paidUnit;
		
				if (paidUnit === 'd' && endDate.diff(startDate, 'days') < paidValue ) {
					errors.requestStart =  t('annualLeave.requestStartEndDateError')
				} else if (paidUnit === 'h' && endDate.diff(startDate, 'hours') < paidValue ) {
					errors.requestStart = t('annualLeave.requestStartEndDateError')
				} else if (paidUnit === 'm' && endDate.diff(startDate, 'minutes') < paidValue ) {
					errors.requestStart = t('annualLeave.requestStartTimeError')
					errors.requestEnd = t('annualLeave.requestStartEndDateError')
				}
			}

			return errors;
		},
		onSubmit: async (values) => {
			if (values.id > 0) {
				// modify
				await RestdayService.modify(values)
					.then((res) => {
						if (res.data) showNotification(t('맞춤 휴가 설정'), t('휴가 설정이 완료되었습니다.'), 'success');
						else showNotification(t('맞춤 휴가 설정'), t('휴가 설정에 문제가 발생 하였습니다.'), 'danger');
					})
					.finally(() => {
						refresh();
						setIsModalOpen(false);
					});
			} else {
				// add
				await RestdayService.add(values)
					.then((res) => {
 
						if (res.data) showNotification(t('맞춤 휴가 설정'), t('휴가 설정이 완료되었습니다.'), 'success');
						else showNotification(t('맞춤 휴가 설정'), t('휴가 설정에 문제가 발생 하였습니다.'), 'danger');
					})
					.finally(() => {
						refresh();
						setIsModalOpen(false);
					});
			}
		},
	});

	// 휴가 부여 방법 MANUAL일 때
	useEffect(() => {
		if(customRestForm.values.option === 'MANUAL'){
			customRestForm.setFieldValue('paidInfo.grantValue', '');
			customRestForm.setFieldValue('paidInfo.grantUnit', '');
		}
	},[customRestForm.values.option]);

	// 휴가 종류 비교
	const isVacationName = (name) => {
		return ['휴직', '정직(징계)', '대출 연차', '대체휴무'].includes(name);
	};

	const messageVar = [
		{ label: t('annualLeave.companyName'), value:  `#{${t('annualLeave.companyName')}}`, key: 'company' },
		{ label:  t('annualLeave.vacationName'), value: `#{${t('annualLeave.vacationName')}}`, key: 'restType' },
		{ label:  t('annualLeave.userName'), value: `#{${t('annualLeave.userName')}}`, key: 'userName' },
		{ label: t('annualLeave.vacationPeriod'), value: `#{${t('annualLeave.vacationPeriod')}}`, key: 'restday' },
		// { label: '휴가시작일', value: '#{휴가시작날짜}', key: 'restStartDate' },
		// { label: '휴가종료일', value: '#{휴가종료날짜}', key: 'restEndDate' },
	];

	const optionArray = [
		{
			value: 'REQUEST',
			text: t('신청시 지급'),
		},
		// {
		// 	value: 'YEAR',
		// 	text: t('매년 지급'),
		// },
		// {
		// 	value: 'MONTH',
		// 	text: t('매월 지급'),
		// },
		// {
		// 	value: 'WORK',
		// 	text: t('근속시 지급'),
		// },
		// {
		// 	value: 'REST',
		// 	text: t('연차 소진시 지급'),
		// },
		{
			value: 'MANUAL',
			text: t('관리자 직접 지급'),
		},
	];

	const handleAddRestMessage = () => {
		const newRestMessages = [...restMessages, ''];
		setRestMessages(newRestMessages);
		restCompanyForm.setFieldValue('restMessage', newRestMessages);
	};

	const handleRestMessageChange = (index, value) => {
		const updatedRestMessages = [...restMessages];
		updatedRestMessages[index] = value;
		setRestMessages(updatedRestMessages);
		restCompanyForm.setFieldValue('restMessage', updatedRestMessages);
	};

	const handleRemoveRestMessage = (index) => {
		const updatedRestMessages = [...restMessages];
		updatedRestMessages.splice(index, 1);
		setRestMessages(updatedRestMessages);
		restCompanyForm.setFieldValue('restMessage', updatedRestMessages);
	};

	const [selectedValue, setSelectedValue] = useState('');
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear]= useState('');
	

	const handleDateChange = (event) => {
	const selectedDate = event.target.value; 
	const formattedDate = moment(selectedDate).format('MM-DD'); 

	restCompanyForm.setFieldValue('restAccrualTransferMaxDate', formattedDate);
  };

	const handleCopyClick = async (key)=>{
		
	const selectedItem = messageVar.find((item) => item.key === key);
	setSelectedValue(selectedItem?.value || '');

	try {
	  await navigator.clipboard.writeText(selectedItem?.value || '');
 
			customRestForm.setFieldValue('alarm', {
				...customRestForm.values.alarm,
				restNotificationMessage: `${customRestForm.values.alarm.restNotificationMessage || ''}\n${selectedItem?.value || ''}`,
			});

	} catch (error) {
	  console.error('텍스트 복사 실패:', error);
	}

	}

	const getAvailableNotificationCycles = () => {
		const notificationTime = customRestForm.values.alarm.notificationTime;
		const availableOptions = [{ value: 'day', text: t('일일') }];

		if (notificationTime <= -29 || notificationTime >= 29) {
			availableOptions.push({ value: 'week', text: t('매주') });
			availableOptions.push({ value: 'month', text: t('매월') });
		} else if (notificationTime <= -7 || notificationTime >= 7) {
			availableOptions.push({ value: 'week', text: t('매주') });
		}

		return availableOptions;
	};

	const getDeadlineDetailList = (deadlineId) => {
		DeadlineService.detailList(deadlineId).then((response) => {
			setOriginDeadlineDetailList(response.data);
			setDeadlineDetailList(response.data);
		});
	}

	const filterDeadlineDetailList = () => {
		let resultList = originDeadlineDetailList;

		if(deadlineDetailNotConfirmed === true) {
			resultList = resultList.filter((result) => !result.confirmed);
		} else if(deadlineDetailNotConfirmed === false) {
			resultList = resultList.filter((result) => result.confirmed);
		}

		resultList = resultList.filter((result) => result.user.name.includes(inputRef1.current.value) && result.companyNumber.includes(inputRef2.current.value)
													&& result.departmentName.includes(inputRef3.current.value) && result.rankName.includes(inputRef4.current.value));

		setDeadlineDetailList(resultList);

		// switch (current.id) {
		// 	case 'name':
		// 		filteredList = filteredList.filter((detail) => !!detail.user.name && detail.user.name.includes(inputRef1.current.value));
		// 		// break;
		// 	case 'companyNumber':
		// 		filteredList = filteredList.filter((detail) => !!detail.companyNumber && detail.companyNumber.includes(inputRef2.current.value));
		// 		// break;
		// 	case 'departmentName':
		// 		filteredList = filteredList.filter((detail) => !!detail.departmentName && detail.departmentName.includes(inputRef3.current.value));
		// 		// break;
		// 	case 'rankName':
		// 		filteredList = filteredList.filter((detail) => !!detail.rankName && detail.rankName.includes(inputRef4.current.value));
		// 		setDeadlineDetailList(filteredList);
		// 		break;
		// 	default:
		// 		setDeadlineDetailList(originDeadlineDetailList);
		// 		break;
		// }
	}

	const openUpdateUsersModal = (deadline) => {
 
		setDeadlineForUpdate(deadline)
		setSelectUserModalOpen(true)
	}

	//******************************************************************************************** */
	// 근무유형 추가
	const customWorkTypeForm = useFormik({
		initialValues: {
			companyId: company.get.id,
			abntdWorkTypKind: null, // 'DEFAULT', 'CUSTOM'
			abntdWorkTypCd: 0,
			abntdWorkTypNm: null,
			abntdWorkTypDtlXpl: null,
			abntdShotnWorkEnx:false,
			abntdShotnWorkKindCd:{
				'preg': false,
				'child': false,
				'fmly': false
			},
			abntdWorkTypFileNm:null,
			abntdRtrcnAplyYn:true,
			abntdMdfcnAplyYn:true,
			abntdPayGiveFrmCd:'PAID',
			abntdEviDataSbmsnClCd:null,
			abntdPowkExpsrYn:false,
			abntdUniPrdAplyYn:false,
			abntdUniPrdDay:0,
			abntdUniPrdClCd:'w',
			abntdChcPrdTypCd:'',
			abntdChcDateTypCd:null,
			abntdTmChcClCd:'',
			abntdAtrzCaldrExpsrYn:false,
			abntdSchdlRfltYn:false,
			abntdAgwrkExpsrYn:false,
			abntdWorkTypStatus:true
		},
		validateOnChange: false,
		validateOnBlur: true,
		validate: (values) => {
			const errors = {};

			if(!values.abntdWorkTypNm){
				errors.abntdWorkTypNm = t('근무유형명을 입력하세요.');
			}

			if(values.abntdChcPrdTypCd === ''){
				errors.abntdChcPrdTypCd = t('선택기간 유형을 선택하세요.');
			}

			if(values.abntdTmChcClCd === ''){
				errors.abntdTmChcClCd = t('시간 설정을 선택하세요.');
			}

			return errors;
		},

		onSubmit: async (values) => {
			values.userId = user?.me?.id;
			if (values.abntdWorkTypCd > 0) {
				// modify
				await WorkTypeService.modify(values)
					.then((res) => {
						if (res.data) showNotification(t('근무유형 추가'), t('근무유형이 수정되었습니다.'), 'success');
						else showNotification(t('근무유형 추가'), t('근무유형 추가에 문제가 발생 하였습니다.'), 'danger');
					})
					.finally(() => {
						refresh();
						setIsModalOpen3(false); 
					});
			} else {
				// add
				await WorkTypeService.add(values)
					.then((res) => {
						if (res?.result) showNotification(t('근무유형 추가'), t('근무유형이 추가되었습니다.'), 'success');
						else showNotification(t('근무유형 추가'), t('근무유형 추가에 문제가 발생 하였습니다.'), 'danger');
					})
					.finally(() => {
						refresh();
						setIsModalOpen3(false); 
					});
			}
		},
	});

	// 단축근로 여부 사용시 옵션
	const shorWorkOptions = [
		{ id: 1, value: 'preg', label: '임신기 단축' },
		{ id: 2, value: 'child', label: '육아기 단축' },
		{ id: 3, value: 'fmly', label: '가족돌봄 단축' },
	]

	useEffect(() => {
		if (!isModalOpen3) {
			customWorkTypeForm.resetForm();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalOpen3]);

	//******************************************************************************************** */
	// 출력
	return (
		<div
			className='' /* hasTab tabButtonColor='info' */ /* onMouseDown={()=>{
			if(isPopOverRef){
				isPopOverRef.current.onClick();
			}
		}} */
		>
			{array &&
				array.length > 0 &&
				array?.map((index, key) => {
					const titleTip =
						index === '직책'
							? t('직책을 추가해보세요')
							: index === '직위'
							? t('드래그로 직위 순위를 조정할수 있습니다.')
							: index === '휴일'
							? t('법정 휴일 외 휴일을 지정할수 있습니다.')
							: index === '휴가'
							? t('맞춤 휴가를 지정 할 수 있습니다')
							: index === '마감 관리'
							? t('workDeadline.managesClosingTAndA')
							: index === '개인별 마감 현황'
							? t('workDeadline.individualAttendanceClosing')
							: index === '근무유형'
							? t('근무유형을 지정할 수 있습니다.')
							: '';
					return (
						<Card key={key} /* title={t(index)} */>
							<CardHeader borderSize={1} borderColor='light' size='lg'>
								<CardLabel>
									<CardTitle>{t(index)}</CardTitle>
									<CardSubTitle className='text-muted'>
										{titleTip}
										<br />
										{index !== '휴가' || index !== '마감 관리' && t('마우스를 올리면 더 많은 편집 기능을 사용할 수 있습니다.')}
									</CardSubTitle>
								</CardLabel>
								<CardActions>
									{index == '직위' ? (
										<ButtonGroup>
											<Button
												color='info'
												//isOutline
												icon='PlusLg'
												onClick={(e) => {
													e.preventDefault();
													props.setModalKind({ 직위: true });
													props.setModalTask(t('추가'));
												}}>
												{t('직위 추가')}
											</Button>
											{/* <Button
												color='info'
												isOutline
												icon='PencilSquare'
												onClick={(e) => {
													e.preventDefault();
													// 직위 수정
													if (updateRankUnit) {
														props.setModalKind({ 직위: true });
														props.setModalTask(t('수정'));
														props.setModalEditThing({
															rank: updateRankUnit.node,
														});
													} else {
														rankMessage();
													}
												}}>
												{t('수정')}
											</Button>
											<Button
												color='info'
												isOutline
												icon='XLg'
												onClick={(e) => {
													e.preventDefault();
													if (deleteRankUnit) {
														deleteRankUnit.node.companyId = company.id;
														deleteRank(deleteRankUnit.node);
													} else {
														rankMessage();
													}
												}}>
												{t('삭제')}
											</Button> */}
										</ButtonGroup>
									) : index == '직책' ? (
										//직책
										<Button
											onClick={() => {
												props.setModalKind({ 직책: true });
												props.setModalTask(t('추가'));
											}}
											color='info'
											icon='PlusLg'>
											{t('직책 추가')}
										</Button>
									) : index == '휴일' ? (
										<Button
											onClick={() => {
												props.setModalKind({ 휴일: true });
												props.setModalTask(t('추가'));
											}}
											color='info'
											icon='PlusLg'>
											{t('휴일 추가')}
										</Button>
									) : index == '마감 관리' ? (
										<CardActions className='d-flex'>
										<Checks
											type='switch'
											checked={deadlineNotComplete || null}
											label={t('workDeadline.excludingClosing')}
											onChange={(e) => {
												if (e.target.checked === true) {
													setDeadlineNotComplete(true);
													setDeadlineList(deadlineList.filter((rowData) => moment(rowData.completeDate).isAfter(moment(), 'day')));
												} else {
													setDeadlineNotComplete(null);
													refresh()
												}
											}}
										/>
										<Button
											color='info'
											icon='PlusLg'
											onClick={() => {
												setDeadlineModalOpen(true)
											} }
										>
											{t('workDeadline.addClosing')}
										</Button>
										</CardActions>
									) : index == '개인별 마감 현황' ? (
										<>
											<CardActions className='d-flex align-items-center'>
												<div>
													<Icon
														icon='CalendarToday'
														className='me-2 mb-1'
													/>
													<span>{t(moment(selectedDeadline.startDate).format('YYYY.MM.DD'))} - {t(moment(selectedDeadline.endDate).format('YYYY.MM.DD'))}</span>
												</div>
												<Checks
													type='switch'
													checked={deadlineDetailNotConfirmed || null}
													label={t('workDeadline.viewUnconfirmedPersonnel')}
													onChange={(e) => {
														if (e.target.checked === true) {
															setDeadlineDetailNotConfirmed(true);
															setSelectedOption(3)
															setDeadlineDetailList(originDeadlineDetailList.filter((detail) => !detail.confirmed));
														} else {
															setDeadlineDetailNotConfirmed(null);
															setSelectedOption(1)
															setDeadlineDetailList(originDeadlineDetailList);
														}
													}}
												/>
												<Button
													color='light'
													isOutline
													onClick={() => {
														setArray(['마감 관리'])
														setDeadlineDetailNotConfirmed(null);
														setSelectedOption(1)
													} }
												>
													<span className='px-2 text-dark'>{t('workDeadline.previousScreen')}</span>
												</Button>
											</CardActions>
										</>
									) : index == '근무유형' ? (
										<Button
											type='button'
											color='light'
											isOutline
											onClick={() => {
												setIsModalOpen3(true); 
											}}>
											<Icon icon='Plus' color='success' size='lg' /> {t('맞춤 근무유형 추가')} 
										</Button>
									) : (
										<></>
									)}
								</CardActions>
							</CardHeader>

							<CardBody>
								{index == '직책' ? (
									<ListGroup>
										<div className='table-responsive'>
											<table
												className='table table-sm user-select-none table-hover'
												style={{
													borderSpacing: 0,
													borderCollapse: 'separate',
												}}>
												<thead>
													<tr>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='30%'
															style={{
																minWidth: '30%',
																width: '30%',
																top: 0,
																zIndex: 3,
															}}>
															{t('직책명')}
														</th>
														<th
															style={{
																top: 0,
																zIndex: 3,
															}}
															scope='col'
															width=''
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom text-end'>
															-
														</th>
													</tr>
												</thead>
												<tbody className=''>
													{positionList
														?.sort((a, b) => (a.id > b.id ? 1 : -1))
														.map((position, index) => (
															// eslint-disable-next-line react/jsx-props-no-spreading
															<PositionItem key={'position' + index} position={position} {...props} refresh={refresh} deletePosition={deletePosition} />
														)) || <div style={{ padding: '5px' }}>{t('설정된 직책이 없습니다')}</div>}
												</tbody>
											</table>
										</div>
									</ListGroup>
								) : index == '직위' ? (
									<SortableContainer onSortEnd={onSortEnd} axis='y' pressDelay={250}>
										{treeData.map((value, index) => (
											<SortableItem key={`item-${value.id}`} index={index} value={value} />
										))}
									</SortableContainer>
								) : index == '휴일' ? (
									<ListGroup>
										<div className='table-responsive'>
											<table
												className='table table-sm user-select-none table-hover'
												style={{
													borderSpacing: 0,
													borderCollapse: 'separate',
												}}>
												<thead>
													<tr>
														<th
															scope='col'
															width='150px'
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															style={{
																top: 0,
																zIndex: 3,
															}}>
															{t('일자')}
														</th>
														<th
															scope='col'
															width='200px'
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															style={{
																top: 0,
																zIndex: 3,
															}}>
															{t('휴일명')}
														</th>
														<th
															scope='col'
															width='150px'
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															style={{
																top: 0,
																zIndex: 3,
															}}>
															{t('대체휴일')}
														</th>
														<th
															scope='col'
															width=''
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom text-end'
															style={{
																top: 0,
																zIndex: 3,
															}}>
															-
														</th>
													</tr>
												</thead>
												<tbody className=''>
													{(holidayList.length &&
														holidayList.map((holiday, index) => {
															return (
																// eslint-disable-next-line react/jsx-props-no-spreading
																<HolyItem key={'holiday' + index} holiday={holiday} {...props} deleteHoliday={deleteHoliday} />
															);
														})) || <div style={{ padding: '5px' ,whiteSpace:"nowrap"}}>{t('holiday.noSetHolidays')}</div>}
												</tbody>
											</table>
										</div>
									</ListGroup>
								) : index == '마감 관리' ? (									
									<ListGroup>
										<div className='table-responsive'>
											<table
												className='table table-sm user-select-none table-hover'
												style={{
													borderSpacing: 0,
													borderCollapse: 'separate',
												}}>
												<thead>
													<tr>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='13%'
															style={{
																minWidth: '190px',
																width: '13%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.closingPeriod')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='7%'
															style={{
																minWidth: '100px',
																width: '7%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.confirmDate')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='15%'
															style={{
																minWidth: '25%', // 15%
																width: '25%', // 15%
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.targeOfPeople')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='7%'
															style={{
																minWidth: '90px',
																width: '7%',
																top: 0,
																zIndex: 3,
															}}>
															{t('상태')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='20%'
															style={{
																minWidth: '20%',
																width: '20%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.closingCount')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='5%'
															style={{
																minWidth: '5%',
																width: '5%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.modifyDetail')}
															{/* 최대 200px까지만 설정되네용 ㅠ */}
															<Tooltips
																title={
																	<div className='text-start p-3 d-flex'>
																		<Icon
																			icon='info'
																			size='lg'
																		/>
																		<span className='ms-2'>{t('workDeadline.modifyTooltip')}</span>
																	</div>
																}
																placement='top'
																flip='right'
															>
																<Icon
																	icon='InfoOutline'
																	className='ms-1'
																	size='lg'
																/>
															</Tooltips>
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='5%'
															style={{
																minWidth: '5%',
																width: '5%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.closingEmployees')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='10%'
															style={{
																minWidth: '10%',
																width: '10%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.lastUpdateDate')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='5%'
															style={{
																minWidth: '76px',
																width: '5%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.mail')}
														</th>
														{/*<th*/}
														{/*	className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '*/}
														{/*	scope='col'*/}
														{/*	width='7%'*/}
														{/*	style={{*/}
														{/*		minWidth: '135px',*/}
														{/*		width: '7%',*/}
														{/*		top: 0,*/}
														{/*		zIndex: 3,*/}
														{/*	}}>*/}
														{/*	{t('다운로드')}*/}
														{/*</th>*/}
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom '
															scope='col'
															width='7%'
															style={{
																minWidth: '135px',
																width: '7%',
																top: 0,
																zIndex: 3,
															}}>
															{t('다운로드')}
														</th>
													</tr>
												</thead>
												<tbody className=''>
												{(deadlineList.length && deadlineList
													.map((deadline, index) => (
														// eslint-disable-next-line react/jsx-props-no-spreading
														<DeadlineItem
															key={'deadline' + index}
															deadline={deadline}
															{...props}
															setArray={setArray}
															setSelectedDeadline={setSelectedDeadline}
															getDetailList={getDeadlineDetailList}
															openUpdateUsersModal={openUpdateUsersModal}
															refresh={refresh}
														/>
														))) ||
														<tr>
															<td colSpan={10} className='py-5 text-center'>{t('workDeadline.noDetailClosing')}</td>
														</tr>
													}
												</tbody>
											</table>
										</div>
									</ListGroup>
								) : index == '개인별 마감 현황' ? (
									<ListGroup>
										<div className='table-responsive'>
											<table
												className='table table-sm user-select-none table-hover'
												style={{
													borderSpacing: 0,
													borderCollapse: 'separate',
												}}>
												<thead>
													<tr>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '15%',
																width: '15%',
																top: 0,
																zIndex: 3,
															}}>
															{t('이름')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '15%',
																width: '15%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.employeeNumber')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '25%',
																width: '25%',
																top: 0,
																zIndex: 3,
															}}>
															{t('부서')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '10%',
																width: '10%',
																top: 0,
																zIndex: 3,
															}}>
															{t('직위')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '20%',
																width: '20%',
																top: 0,
																zIndex: 3,
															}}>
															{t('상태')}
														</th>
														<th
															className='table-sticky bg-white py-4 px-4 align-middle border-active-bottom'
															scope='col'
															width='20%'
															style={{
																minWidth: '15%',
																width: '15%',
																top: 0,
																zIndex: 3,
															}}>
															{t('workDeadline.confirmedDate')}
														</th>
													</tr>
													<tr>
														<th className='p-3 align-middle border-active-bottom'>
															<Input
																type='text'
																ref={inputRef1}
																id="name"
																placeholder={t('workDeadline.name')}
																onKeyDown={async (e) => {
																	if (e.key === 'Enter') {
																		try {
																			filterDeadlineDetailList()
																		} catch(error) {
 
																		}
																	}
																}}
															/>
														</th>
														<th className='p-3 align-middle border-active-bottom'>
															<Input
																type='text'
																ref={inputRef2}
																id="companyNumber"
																placeholder={t('workDeadline.employeeNumber')}
																onKeyDown={async (e) => {
																	if (e.key === 'Enter') {
																		try {
																			filterDeadlineDetailList()
																		} catch(error) {
 
																		}
																	}
																}}
															/>
														</th>
														<th className='p-3 align-middle border-active-bottom'>
															<Input
																type='text'
																ref={inputRef3}
																id="departmentName"
																placeholder={t('workDeadline.department')}
																onKeyDown={async (e) => {
																	if (e.key === 'Enter') {
																		try {
																			filterDeadlineDetailList()
																		} catch(error) {
 
																		}
																	}
																}}
															/>
														</th>
														<th className='p-3 align-middle border-active-bottom'>
															<Input
																type='text'
																ref={inputRef4}
																id="rankName"
																placeholder={t('workDeadline.position')}
																onKeyDown={async (e) => {
																	if (e.key === 'Enter') {
																		try {
																			filterDeadlineDetailList()
																		} catch(error) {
 
																		}
																	}
																}}
															/>
														</th>
														<th className='p-3 align-middle border-active-bottom'>
															<Select
																list={keywordData}
																value={selectedOption}
																onChange={(e) => {
																	if (e.target.value === '1') {
																		setDeadlineDetailNotConfirmed(null);
																		setDeadlineDetailList(originDeadlineDetailList);
																	} else {
																		if(e.target.value === '2') {
																			setDeadlineDetailNotConfirmed(false);
																			setDeadlineDetailList(originDeadlineDetailList.filter((detail) => detail.confirmed));
																		} else {
																			setDeadlineDetailNotConfirmed(true);
																			setDeadlineDetailList(originDeadlineDetailList.filter((detail) => !detail.confirmed));
																		}
																	}
																	setSelectedOption(e.target.value);
																}}>
																{keywordData.map((data, index) => (
																	<Option key={index} value={data.value}>
																		{t(data.label)}
																	</Option>
																))}
															</Select>
														</th>
														<th className='p-3 align-middle border-active-bottom'>
															{t(moment(selectedDeadline.completeDate).format('YYYY.MM.DD'))}
														</th>
													</tr>
												</thead>
												<tbody className=''>
												{deadlineDetailList
													.map((deadlineDetail, index) => (
														// eslint-disable-next-line react/jsx-props-no-spreading
														<DeadlineDetailItem key={'deadlineDetail' + index} deadline={selectedDeadline} deadlineDetail={deadlineDetail} {...props} />
														)) ||
														<tr>
															<td colSpan={6} className='py-5 text-center'>{t('workDeadline.noRecordAttendance')}</td>
														</tr>
													}
												</tbody>
											</table>
										</div>
									</ListGroup>
								) : index == '휴가' ? (
									<ListGroup>
										<Card stretch shadow='none' borderSize={0}>
											<CardHeader>
												<CardLabel>
													<CardTitle>{t('휴가 정책')}</CardTitle>
												</CardLabel>
												<CardActions>
													<div className='d-flex'>
														<div className='small d-flex align-items-end mx-2'>
															<Link to={'/rest/list'}>{t('직원 휴가 관리 바로가기')}</Link>
														</div>
														<Button
															type='button'
															color='light'
															isOutline
															onClick={() => {
																restCompanyForm.setValues(company.get).then(() => {
																	setIsModalOpen2(true);
																});
															}}>
															{t('정책 설정')} <Icon icon='ChevronRight' size='lg' />
														</Button>
													</div>
												</CardActions>
											</CardHeader>
											<CardBody className='row'>
												{/* <Card stretch shadow='none' borderSize={1} className='rounded'>
													<CardHeader>
														<CardLabel>
															<CardSubTitle>{t('사용 단위')}</CardSubTitle>
														</CardLabel>
													</CardHeader>
													<CardBody className='fs-4'>{company.get.restUseUnit === 'DAY' ? t('일') : company.get.restUseUnit === 'HALF' ? t('반차') : t('시간')}</CardBody>
												</Card> */}
												<div className='col-md-3'>
													<Card stretch shadow='none' borderSize={1} className='rounded'>
														<CardHeader>
															<CardLabel>
																<CardSubTitle>{t('연차 부여 기준일')}</CardSubTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='fs-4'>
																{company.get.restType ? t('회계일') : t('입사일')}
																{company.get.restType && (
																	<Badge color='ms-3' className='ps-md-only-0'>
																		<small className='text-success'>{company.get.restDate}</small>
																	</Badge>
																)}
															</div>
															<div className='mt-3 vacation_card_space'>
																<div className='card_tit'>{t('입사자 월차')} |</div>
																<div className='card_desc text-success'>
																	{selectedRestOptionText(company.get.restOptionMonth, restOptionMonthList)}
																</div>
															</div>
															<div className='mt-2 vacation_card_space'>
																<div className='card_tit'>{t('입사자 연차')} |</div>
																<div className='card_desc text-success'>
																	{selectedRestOptionText(company.get.restOptionYear, restOptionYearList)} <span>({selectedRestOptionText(company.get.restRoundYear, restOptionRoundYearList)})</span>
																</div>
															</div>
														</CardBody>
													</Card>
												</div>

												<div className='col-md-3'>
													<Card stretch shadow='none' borderSize={1} className='rounded'>
														<CardHeader>
															<CardLabel>
																<CardSubTitle>{t('연차 촉진 설정')}</CardSubTitle>
															</CardLabel>
														</CardHeader>
														<CardBody className='fs-4'>{company.get.restPromote ? t('켜짐') : t('꺼짐')}</CardBody>
													</Card>
												</div>

												<div className='col-md-3'>
													<Card stretch shadow='none' borderSize={1} className='rounded'>
														<CardHeader>
															<CardLabel>
																<CardSubTitle>{t('annualLeave.annualLeaveCarryover')}</CardSubTitle>
															</CardLabel>
														</CardHeader>
														<CardBody>
															<div className='fs-4'>
																{company.get.restAccrualTransfer ? t('사용') : t('미사용')}
																{company.get.restAccrualTransfer == true && (
																	<Badge color='ms-3'>
																		<small className='text-success'>{company.get.restAccrualTransferMax}{t('개 까지')}</small>
																	</Badge>
																)}
															</div>
															<div className='mt-3 vacation_card_space'>
																<div className='card_tit' style={{width:'62px'}}>{t('신청 기간')} |</div>
																{company.get.restAccrualTransferStart && company.get.restAccrualTransferEnd
																	? (
																		<div className='card_desc text-success'>
																			{company.get.restAccrualTransferStart} 부터 {company.get.restAccrualTransferEnd} 까지
																		</div>
																	) : (
																		<div>없음</div>
																	)
																}
															</div>
														</CardBody>
													</Card>
												</div>

												<div className='col-md-3'>
													<Card stretch shadow='none' borderSize={1} className='rounded'>
														<CardHeader>
															<CardLabel>
																<CardSubTitle>{t('workDeadline.negativeAnnualLeave')}</CardSubTitle>
															</CardLabel>
														</CardHeader>
														<CardBody className='fs-4'>
															{company.get.restAllowNegativeAccrual ? t('사용') : t('미사용')}
															{company.get.restAllowNegativeAccrual == true && (
																<Badge color='ms-3'>
																	<small className='text-success'>{company.get.restNegativeAccrualMax}{t('개 까지')}</small>
																</Badge>
															)}
														</CardBody>
													</Card>
												</div>

												<OffCanvas isOpen={isModalOpen2} setOpen={setIsModalOpen2}>
													<OffCanvasHeader setOpen={setIsModalOpen2}>
														<OffCanvasTitle>{t('휴가 정책 설정')}</OffCanvasTitle>
													</OffCanvasHeader>
													<OffCanvasBody>
														<div className='text-end'>
															<Button
																type='button'
																color='info'
																onClick={() => {
																	setIsOpenVacationPolicyConfirmModal(true);
																	// restCompanyForm.submitForm();
																}}>
																{t('저장')}
															</Button>
														</div>
														<form id='restCompanyForm' onSubmit={restCompanyForm.handleSubmit}>
															<hr />

															<FormGroup label={t('정책')} className='mb-4'>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('연차기준')}</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup size=''>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={!restCompanyForm.values.restType ? 'info' : 'light'}
																				isLight={!restCompanyForm.values.restType}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restType', false);
																					restCompanyForm.setFieldValue('restOptionYear', 0);
																				}}>
																				{t('입사년도')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restType ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restType}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restType', true);
																					restCompanyForm.setFieldValue('restOptionYear', 1);
																					restCompanyForm.setFieldValue('restDate', '01-01');
																				}}>
																				{t('회계년도')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div>
																{restCompanyForm.values.restType && (
																	<div className='row mb-2'>
																		<Label className='form-label col-form-label col-sm-4 ps-4'>&nbsp;</Label>
																		<div className='col-sm-8'>
																			<InputGroup>
																				<Select
																					list={Array.from(Array(12).keys()).map((v) => {
																						return { value: v + 1, text: v + 1 };
																					})}
																					placeholder={t('월 선택')}
																					value={restCompanyForm.values.restDate && restCompanyForm.values.restDate.split('-')[0].replace(/(^0+)/, '')}
																					onChange={(e) => {
																						let t = restCompanyForm.values.restDate.split('-');
																						t[0] = String(e.target.value).padStart(2, '0');
																						restCompanyForm.setFieldValue('restDate', t.join('-'));
																					}}
																				/>
																				<InputGroupText>{t('월')}</InputGroupText>
																				<Select
																					list={Array.from(Array(parseInt(moment(restCompanyForm.values.restDate.split('-')[0], 'MM').endOf('M').format('DD'))).keys()).map((v) => {
																						return { value: v + 1, text: v + 1 };
																					})}
																					placeholder={t('annualLeave.selectDate')}
																					value={restCompanyForm.values.restDate && restCompanyForm.values.restDate.split('-')[1].replace(/(^0+)/, '')}
																					onChange={(e) => {
																						let t = restCompanyForm.values.restDate.split('-');
																						t[1] = String(e.target.value).padStart(2, '0');
																						restCompanyForm.setFieldValue('restDate', t.join('-'));
																					}}
																				/>
																				<InputGroupText>{t('일')}</InputGroupText>
																			</InputGroup>
																		</div>
																	</div>
																)}

																{/* <div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('사용단위')}</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restUseUnit === 'DAY' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restUseUnit === 'DAY'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restUseUnit', 'DAY');
																				}}>
																				{t('대문자일')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRadius: 7,
																					borderBottomRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restUseUnit === 'HALF' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restUseUnit === 'HALF'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restUseUnit', 'HALF');
																				}}>
																				{t('반차')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restUseUnit === 'TIME' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restUseUnit === 'TIME'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restUseUnit', 'TIME');
																				}}>
																				{t('시간(분)')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div> */}

																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('입사자 월차')}</Label>
																	<div className='col-sm-8'>
																		<Select
																			name='restOptionMonth'
																			list={restOptionMonthList}
																			onInput={(e) => {
																				restCompanyForm.setFieldValue('restOptionMonth', e.target.value);
																			}}
																			value={restCompanyForm.values.restOptionMonth}
																		/>
																	</div>
																</div>
																{restCompanyForm.values.restType && (
																	<>
																		<div className='row mb-2'>
																			<Label className='form-label col-form-label col-sm-4 ps-4'>{t('입사자 연차')}</Label>
																			<div className='col-sm-8'>
																				<Select
																					name='restOptionYear'
																					list={restOptionYearList}
																					onInput={(e) => {
																						restCompanyForm.setFieldValue('restOptionYear', parseInt(e.target.value));
																					}}
																					value={restCompanyForm.values.restOptionYear}
																				/>
																			</div>
																		</div>
																		{restCompanyForm.values.restOptionYear <= 2 && (
																			<div className='row mb-2'>
																				<Label className='form-label col-form-label col-sm-4 ps-4'>{t('companySetting.proportionalOption')}</Label>
																				<div className='col-sm-8'>
																					<Select
																						name='restRoundYear'
																						list={restOptionRoundYearList}
																						onInput={(e) => {
																							restCompanyForm.setFieldValue('restRoundYear', e.target.value);
																						}}
																						value={restCompanyForm.values.restRoundYear}
																					/>
																				</div>
																			</div>
																		)}
																	</>
																)}

																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('연차촉진')}{' '}
																		<Popovers desc={t('연차촉진 제도 | 업데이트 예정입니다')}>
																			<Icon icon='InfoOutline' color='dark' />
																		</Popovers>
																	</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restPromote ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restPromote}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restPromote', true);
																				}}>
																				{t('사용')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={!restCompanyForm.values.restPromote ? 'info' : 'light'}
																				isLight={!restCompanyForm.values.restPromote}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restPromote', false);
																				}}>
																				{t('미사용')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div>

																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('휴가 노출 방식')}
																	</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restMethod === 'ALL' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restMethod === 'ALL'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restMethod', 'ALL');
																				}}>
																				{t('모두')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restMethod === 'DAY' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restMethod === 'DAY'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restMethod', 'DAY');
																				}}>
																				{t('일')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restMethod === 'TIME' ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restMethod === 'TIME'}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restMethod', 'TIME');
																				}}>
																				{t('시간')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div>
															</FormGroup>

															<hr />

															{/* <FormGroup label={t('소멸 정책')} className='mb-4'>
																<div className='row mb-2 ps-4'>
																	<Label className='form-label col-form-label col-sm-12'>{t('월차 자동 소멸')}</Label>
																	<div className='col-sm-12'>
																		<InputGroup>
																			<Select
																				name='restDestoryMonth'
																				list={[
																					{ value: false, text: t('소멸 없음') },
																					{ value: true, text: t('1년 후 소멸') },
																				]}
																				onInput={(e) => {
																					restCompanyForm.setFieldValue('restGraceMonth', 0);
																					restCompanyForm.setFieldValue('restDestoryMonth', e.target.value === 'true');
																				}}
																				value={restCompanyForm.values.restDestoryMonth}
																			/>
																			<InputGroupText>{t('유예')}</InputGroupText>
																			{restCompanyForm.values.restDestoryMonth ? (
																				<Select
																					name='restGraceMonth'
																					list={Array.from(Array(12).keys()).map((v) => {
																						return { value: parseInt(v), text: v === 0 ? t('유예 기간 없음') : v + " " + t('개월 유예') };
																					})}
																					onInput={(e) => {
																						restCompanyForm.setFieldValue('restGraceMonth', parseInt(e.target.value));
																					}}
																					value={restCompanyForm.values.restGraceMonth}
																				/>
																			) : (
																				<Select list={[{ value: 0, text: t('유예 기간 없음') }]} />
																			)}
																		</InputGroup>
																	</div>
																</div>
																<div className='row mb-2 ps-4'>
																	<Label className='form-label col-form-label col-sm-12'>{t('연차 자동 소멸')}</Label>
																	<div className='col-sm-12'>
																		<InputGroup>
																			<Select
																				name='restDestoryYear'
																				list={[
																					{ value: false, text: t('소멸 없음') },
																					{ value: true, text: t('1년 후 소멸') },
																				]}
																				onInput={(e) => {
																					restCompanyForm.setFieldValue('restGraceYear', 0);
																					restCompanyForm.setFieldValue('restDestoryYear', e.target.value === 'true');
																				}}
																				value={restCompanyForm.values.restDestoryYear}
																			/>
																			<InputGroupText>{t('유예')}</InputGroupText>
																			{restCompanyForm.values.restDestoryYear ? (
																				<Select
																					name='restGraceYear'
																					list={Array.from(Array(12).keys()).map((v) => {
																						return { value: parseInt(v), text: v === 0 ? t('유예 기간 없음') : v + ' ' + t('개월 유예') };
																					})}
																					onInput={(e) => {
																						restCompanyForm.setFieldValue('restGraceYear', parseInt(e.target.value));
																					}}
																					value={restCompanyForm.values.restGraceYear}
																				/>
																			) : (
																				<Select list={[{ value: 0, text: t('유예 기간 없음') }]} />
																			)}
																		</InputGroup>
																	</div>
																</div>
															</FormGroup> */}

															<FormGroup label={t('annualLeave.annualLeaveSetting')} className='mb-4'>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('annualLeave.annualLeaveCarryover')}</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restAccrualTransfer ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restAccrualTransfer}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restAccrualTransferMax', company.get.restAccrualTransferMax || 1);
																					restCompanyForm.setFieldValue('restAccrualTransferGrace', company.get.restAccrualTransferGrace || 1);
																					restCompanyForm.setFieldValue('restAccrualTransfer', true);
																				}}>
																				{t('사용')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={!restCompanyForm.values.restAccrualTransfer ? 'info' : 'light'}
																				isLight={!restCompanyForm.values.restAccrualTransfer}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restAccrualTransferMax', 0);
																					restCompanyForm.setFieldValue('restAccrualTransferGrace', 0);
																					restCompanyForm.setFieldValue('restAccrualTransfer', false);
																				}}>
																				{t('미사용')}
																			</Button>
																		</ButtonGroup>
																		{restCompanyForm.values.restAccrualTransfer && (
																			<div className='row mb-2'>
																				{/* {t('제한갯수')} */}
																				<div className='col-sm-6 mt-3'>
																					<InputGroup>
																						<Input
																							type='number'
																							max={25}
																							value={restCompanyForm.values.restAccrualTransferMax}
																							onChange={(e) => {
																								const inputText = e.target.value;
																								const numericRegex = /^[0-9]*$/;
																								if (numericRegex.test(inputText)) {
																									const value = parseInt(inputText, 10);
																									const min = 1;
																									if (!isNaN(value) && value >= min) {
																										restCompanyForm.setFieldValue('restAccrualTransferMax', value);
																									}
																								}
																							}}
																						/>
																						<InputGroupText>
																							<span className='text-muted'>{t('workDeadline.until')}</span>
																						</InputGroupText>
																					</InputGroup>
																				</div>
																			</div>
																		)}
																	</div>
																</div>

																	{restCompanyForm.values.restAccrualTransfer && (
																		<>
																			<div className='row mb-2'>
																				<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.carryoverLeave')}</Label>
																				<div className='col-sm-8 custom_date_box'>
																					<InputGroup>
																						<Input
																							name='startAtMonth'
																							type='number'
																							placeholder="MM"
																							min={1}
																							maxlength={2}
																							value={restCompanyForm.values.restAccrualTransferStart && restCompanyForm.values.restAccrualTransferStart.split('-')[0]}
																							onChange={(e) => handleInpDateChange(e, 'month', 12, 'startAtMonth', startDayRef)}
																							onBlur={(e) => handleInpDateBlur(e, 'startAtMonth')}
																							ref={startMonthRef}
																						/>
																						<Input
																							name='startAtDay'
																							type='number'
																							placeholder="DD"
																							min={1}
																							maxlength={2}
																							value={restCompanyForm.values.restAccrualTransferStart && restCompanyForm.values.restAccrualTransferStart.split('-')[1]}
																							onChange={(e) => handleInpDateChange(e, 'day', 31, 'startAtDay', endMonthRef)}
																							onBlur={(e) => handleInpDateBlur(e, 'startAtDay')}
																							ref={startDayRef}
																						/>
																						<InputGroupText>~</InputGroupText>
																						<Input
																							name='endAtMonth'
																							type='number'
																							placeholder="MM"
																							min={1}
																							maxlength={2}
																							value={restCompanyForm.values.restAccrualTransferEnd && restCompanyForm.values.restAccrualTransferEnd.split('-')[0]}
																							onChange={(e) => handleInpDateChange(e, 'month', 12, 'endAtMonth', endDayRef)}
																							onBlur={(e) => handleInpDateBlur(e, 'endAtMonth')}
																							ref={endMonthRef}
																						/>
																						<Input
																							name='endAtDay'
																							type='number'
																							placeholder="DD"
																							min={1}
																							maxlength={2}
																							value={restCompanyForm.values.restAccrualTransferEnd && restCompanyForm.values.restAccrualTransferEnd.split('-')[1]}
																							onChange={(e) => handleInpDateChange(e, 'day', 31, 'endAtDay', 'last')}
																							onBlur={(e) => handleInpDateBlur(e, 'endAtDay')}
																							ref={endDayRef}
																						/>
																					</InputGroup>
																					<div
																						className='p-2 my-3 d-flex'
																						style={{
																							backgroundColor: '#F1F1F1B2',
																							border: 'solid 1px #D9D9D9',
																							borderRadius: 6,
																						}}>
																						<div className='me-2'>
																							<Icon icon='Error' color='warning' size='lg' className='mx-1' />
																						</div>
																						<div>
																							<span className='' style={{ color: '#808080', fontSize: 12 }}>
																								{t('workDeadline.accordingLaborNote')}
																							</span>
																						</div>
																					</div>
																				</div>
																			</div>

																			<div className='row mb-2'>
																				<Label className='form-label col-form-label col-sm-4 ps-4'>{t('이월연차 인원 범위')}</Label>
																				<div className='col-sm-8'>
																					<ButtonGroup>
																						<Button
																							type='button'
																							style={{
																								borderTopLeftRadius: 7,
																								borderBottomLeftRadius: 7,
																								border: '1px solid #EDF0FF',
																							}}
																							color={!restCompanyForm.values.restScope ? 'info' : 'light'}
																							isLight={!restCompanyForm.values.restScope}
																							onClick={() => {
																								restCompanyForm.setFieldValue('restScope', false);
																							}}>
																							{t('전체')}
																						</Button>
																						<Button
																							type='button'
																							style={{
																								borderTopRightRadius: 7,
																								borderBottomRightRadius: 7,
																								border: '1px solid #EDF0FF',
																							}}
																							color={restCompanyForm.values.restScope ? 'info' : 'light'}
																							isLight={restCompanyForm.values.restScope}
																							onClick={() => {
																								restCompanyForm.setFieldValue('restScope', true);
																								setRestScopeModalOpen(true);
																							}}>
																							{t('선택 지정')}
																						</Button>
																					</ButtonGroup>
																				</div>
																			</div>
																		</>
																	)}

																{/* {restCompanyForm.values.restAccrualTransfer && (
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.annualLeaveExpirationDate')}</Label>
																	<div className='col-sm-8'>
																		<div className='col-sm-8'>
																			<InputGroup>
																				<Input
																					type='number'
																					min={1}
																					max={12}
																					value={restCompanyForm.values.restAccrualTransferGrace}
																					onChange={(e) => {
																						const inputText = e.target.value;
																						restCompanyForm.setFieldValue('restAccrualTransferGrace', parseInt(inputText));
																					}}
																				/>
																				<InputGroupText>
																					<span className='text-muted'>{t('workDeadline.expiresAfterMonth')}</span>
																				</InputGroupText>
																			</InputGroup>
																		</div>
																	</div>
																</div>
																)} */}

																<div className='row mb-2'>
																	{/* <Label className='form-label col-form-label col-sm-4 ps-4'>{t('이월연차 우선사용')}</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup size=''>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.priorityUse ? 'info' : 'light'}
																				isLight={restCompanyForm.values.priorityUse}
																				onClick={() => {
																					restCompanyForm.setFieldValue('priorityUseMax', '1');
																					restCompanyForm.setFieldValue('priorityUse', true);
																				}}>
																				{t('사용')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={!restCompanyForm.values.priorityUse ? 'info' : 'light'}
																				isLight={!restCompanyForm.values.priorityUse}
																				onClick={() => {
																					restCompanyForm.setFieldValue('priorityUseMax', '1');
																					restCompanyForm.setFieldValue('priorityUse', false);
																				}}>
																				{t('미사용')}
																			</Button>
																		</ButtonGroup>
																	</div> */}
																	{/* <div>
																<Icon icon='Error' color='#DADADA' size='lg' style={{color: '#DADADA',}} className='m-2'/>
																<span className='' style={{color: '#808080', fontSize: 13}}>{t('사용 시 이월된 연차를 우선적으로 소진합니다.')}</span>
															</div> */}
																	{/* {restCompanyForm.values.priorityUse && (
																	<>
																		{t('제한갯수')}
																		<Input
																			type='number'
																			value={restCompanyForm.values.priorityUseMax}
																			onChange={(e) => {
																				const inputText = e.target.value;
																				const numericRegex = /^[0-9]*$/;
																				if (numericRegex.test(inputText)) {
																					const value = parseInt(inputText, 10);
																					const min = 1;
																					if (!isNaN(value) && value >= min) {
																						restCompanyForm.setFieldValue('priorityUseMax', value);
																					}
																				}
																			}}
																		/>
																	</>
																)} */}
																</div>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.negativeAnnualLeave')}</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup size=''>
																			<Button
																				type='button'
																				style={{
																					borderTopLeftRadius: 7,
																					borderBottomLeftRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={restCompanyForm.values.restAllowNegativeAccrual ? 'info' : 'light'}
																				isLight={restCompanyForm.values.restAllowNegativeAccrual}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restNegativeAccrualMax', 1);
																					restCompanyForm.setFieldValue('restAllowNegativeAccrual', true);
																				}}>
																				{t('사용')}
																			</Button>
																			<Button
																				type='button'
																				style={{
																					borderTopRightRadius: 7,
																					borderBottomRightRadius: 7,
																					border: '1px solid #EDF0FF',
																				}}
																				color={!restCompanyForm.values.restAllowNegativeAccrual ? 'info' : 'light'}
																				isLight={!restCompanyForm.values.restAllowNegativeAccrual}
																				onClick={() => {
																					restCompanyForm.setFieldValue('restNegativeAccrualMax', 0);
																					restCompanyForm.setFieldValue('restAllowNegativeAccrual', false);
																				}}>
																				{t('미사용')}
																			</Button>
																		</ButtonGroup>
																		{restCompanyForm.values.restAllowNegativeAccrual && (
																			<div className=''>
																				<div className='col-sm-6 my-3'>
																					<InputGroup>
																						<Input
																							type='number'
																							value={restCompanyForm.values.restNegativeAccrualMax}
																							onChange={(e) => {
																								const inputText = e.target.value;
																								const numericRegex = /^[0-9]*$/;
																								if (numericRegex.test(inputText)) {
																									const value = parseInt(inputText, 10);
																									const min = 1;
																									if (!isNaN(value) && value >= min) {
																										restCompanyForm.setFieldValue('restNegativeAccrualMax', value);
																									}
																								}
																							}}
																						/>
																						<InputGroupText>
																							<span className='text-muted'>{t('workDeadline.until')}</span>
																						</InputGroupText>
																					</InputGroup>
																				</div>
																			</div>
																		)}
																	</div>
																</div>
																<hr />
															</FormGroup>
														</form>
													</OffCanvasBody>
												</OffCanvas>

											</CardBody>
										</Card>

										<Card stretch shadow='none' borderSize={0}>
											<CardHeader>
												<CardLabel>
													<CardTitle>{t('휴가 종류')}</CardTitle>
													<CardSubTitle className='text-muted'>{t('직접 휴가 설정을 관리할수 있습니다.')}</CardSubTitle>
												</CardLabel>
												<CardActions>
													<Button
														type='button'
														color='light'
														isOutline
														onClick={() => {
															setIsModalOpen(true);
														}}>
														<Icon icon='Plus' color='success' size='lg' /> {t('맞춤 휴가 추가')}
													</Button>
												</CardActions>
											</CardHeader>
											<CardBody>
												<div className='row'>
													{vacationList?.map((vacation, index) => {
														const txt = optionArray.find((v) => v.value === vacation.option);
														return (
															<div key={index} className='col-md-3'>
																<Card stretch shadow='none' borderSize={1} className={'rounded'}>
																	<CardHeader className='flex-row'>
																		<CardLabel>
																			<CardTitle>
																				{vacation.name}{' '}
																				{vacation.type === 'REST_CUSTOM' && (
																					<Badge color='success' rounded={0}>
																						{t('맞춤')}
																					</Badge>
																				)}
																			</CardTitle>
																			{/* <CardSubTitle>
																					asdasd
																				</CardSubTitle> */}
																		</CardLabel>
																		<CardActions>
																			<Popovers
																				triger='click'
																				placement='bottom'
																				className='mw-100'
																				ref={isPopOverRef}
																				desc={
																					<ButtonGroup isVertical /* isToolbar */ size='sm'>
																						<Button
																							type='button'
																							onClick={() => {
																								isPopOverRef.current.onClick();
																								customRestForm.resetForm();
																								customRestForm.setValues({
																									...vacation,
																								});
																								setIsModalOpen(true);
																								setVacationName(isVacationName(vacation.name));
																							}}>
																							{t('adminMode.mainpage.modify')}
																						</Button>
																						{vacation.type === 'REST_CUSTOM' && (
																							<Button
																								type='button'
																								onClick={() => {
																									isPopOverRef.current.onClick();
																									customRestForm.resetForm();
																									customRestForm.setValues({
																										...vacation,
																									});
																									setIsModalConfrim(true);
																								}}>
																								{t('삭제')}
																							</Button>
																						)}
																					</ButtonGroup>
																				}>
																				<Button type='button' color='succcess' icon='ThreeDotsVertical' />
																			</Popovers>
																		</CardActions>
																	</CardHeader>
																	<CardBody>
																		{vacation.paidInfo.paidType === 'PAID' ? t('유급') : vacation.paidInfo.paidType === 'UNPAID' ? t('무급') :  vacation.paidInfo.paidType === 'SPLIT' ? t('분할') : t('비율')} | {txt && txt.text}
																	</CardBody>
																</Card>
															</div>
														);
													})}
												</div>
											</CardBody>
										</Card>
										<OffCanvas isOpen={isModalOpen} setOpen={setIsModalOpen}>
											<OffCanvasHeader setOpen={setIsModalOpen}>
												<OffCanvasTitle>{t('맞춤 휴가 설정')}</OffCanvasTitle>
											</OffCanvasHeader>
											<OffCanvasBody>
												<div className='text-end'>
													<Button
														type='button'
														color='info'
														onClick={() => {
															customRestForm.submitForm();
														}}>
														{customRestForm.values.id === 0 ? t('저장') : t('adminMode.mainpage.modify')}
													</Button>
												</div>
												<form id='customRestForm' onSubmit={customRestForm.handleSubmit}>
													<FormGroup label={t('기본 설정')} className='mb-4'>
														<Input
															type='text'
															name='name'
															value={t(customRestForm.values.name)}
															//isValid={customRestForm.isValid}
															invalidFeedback={customRestForm.errors.name}
															isTouched={customRestForm.touched.name}
															onBlur={customRestForm.handleBlur}
															onChange={(e) => {
																customRestForm.setFieldValue('name', e.target.value, false);
															}}
															readOnly={customRestForm.values.type !== 'REST_CUSTOM'}
															placeholder={t('맞춤 휴가 이름')}
															className='mb-2'
														/>
														{/* {customRestForm?.touched.name && customRestForm.errors.name ? (
																		<div className='d-flex justify-content-end mb-1'>
																			<span className='text-white p-1 rounded bg-danger small fw-light'>
																				<Icon icon='info' />
																				{t(customRestForm.errors.name)}
																			</span>
																		</div>
																	) : null} */}
														<Input
															type='text'
															value={t(customRestForm.values.code)}
															onChange={(e) => {
																customRestForm.setFieldValue('code', e.target.value, false);
															}}
															invalidFeedback={customRestForm.errors.code}
															isTouched={customRestForm.touched.code}
															onBlur={customRestForm.handleBlur}
															//readOnly={customRestForm.values.type !== 'REST_CUSTOM'}
															placeholder={t('annualLeave.vacationCode')}
															className='mb-2'
														/>
														<Textarea
															rows={2}
															value={customRestForm.values.memo || ''}
															onChange={(e) => {
																customRestForm.setFieldValue('memo', e.target.value, false);
															}}
															placeholder={t('휴가에 대한 설명을 입력해주세요')}
														/>
													</FormGroup>

													<FormGroup label={t('상세 설정')} className='mb-4'>
														{customRestForm.values.type === 'REST_CUSTOM' && (
															<div className='row mb-2'>
																<Label className='form-label col-form-label col-sm-4 ps-4'>{t('휴가 부여 방법')}</Label>
																<div className='col-sm-8'>
																	<Select
																		//size='sm'
																		name='option'
																		list={optionArray}
																		onInput={(e) => {
																			const name = customRestForm.values.name;
																			const type = customRestForm.values.type;
																			const id = customRestForm.values.id;
																			customRestForm.resetForm();
																			customRestForm.setFieldValue('name', name, false);
																			customRestForm.setFieldValue('type', type, false);
																			customRestForm.setFieldValue('id', id, false);
																			customRestForm.setFieldValue('option', e.target.value);
																		}}
																		value={customRestForm.values.option}
																	/>
																</div>
															</div>
														)}

														{customRestForm.values.option === 'REQUEST' && (
															<div className='row mb-2'>
																<Label className='form-label col-form-label col-sm-4 ps-4'>
																	{t('부여 일수')}
																	<Popovers desc={t('기간내에 사용할 수 있는 총 휴가일수')}>
																		<Icon icon='InfoOutline' color='dark' className='ms-1' />
																	</Popovers>
																</Label>
																<div className='col-sm-8'>
																	<InputGroup>
																		<Input
																			id='maxUnit'
																			type='number'
																			onBlur={customRestForm.handleBlur}
																			value={
																				customRestForm.values.paidInfo.grantValue
																			}
																			min={0}
																			readOnly={customRestForm.values.paidInfo.grantUnit == ''}
																			onChange={(e) => {
																				const val = e.target.value;
																				customRestForm.setFieldValue(
																					'paidInfo',
																					{
																						...customRestForm.values.paidInfo,
																						grantValue: val,
																					},
																					false
																				);
																			}}
																		/>
																		<Select
																			list={[
																				{
																					value: '',
																					label: t('지급 미정'),
																				},
																				{
																					value: 'd',
																					label: t('대문자일'),
																				},
																				{
																					value: 'h',
																					label: t('대문자시간'),
																				},
																			]}
																			value={customRestForm.values.paidInfo.grantUnit}
																			onBlur={customRestForm.handleBlur}
																			onChange={(e) => {
																				const selectedUnit = e.target.value;
																				customRestForm.setFieldValue(
																					'paidInfo',
																					{
																						...customRestForm.values.paidInfo,
																						grantValue: selectedUnit === '' ? '' : (customRestForm.values.paidInfo.grantValue || 0),
																						grantUnit: selectedUnit,
																					},
																					false
																				);
																			}}
																		/>
																	</InputGroup>
																</div>
															</div>
														)}

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('신청 가능 최대 일수')}
																<Popovers desc={t('한번에 신청할 수 있는 최대 일수입니다.')}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1' />
																</Popovers>
															</Label>
															<div className='col-sm-8'>
															<InputGroup>
																	<Input
																		id='paidUnit'
																		type='number'
																		onBlur={customRestForm.handleBlur}
																		value={
																			customRestForm.values.paidInfo.paidValue
																		}
																		//step={0.25}
																		min={0}
																		readOnly={customRestForm.values.paidInfo.paidUnit == ''}
																		onChange={(e) => {
																			customRestForm.setFieldValue(
																				'paidInfo',
																				{
																					...customRestForm.values.paidInfo,
																					paidValue: e.target.value,
																				},
																				false
																			);
																		}}
																	/>
																	<Select
																		list={[
																			{
																				value: '',
																				label: t('지급 미정'),
																			},
																			{
																				value: 'd',
																				label: t('대문자일'),
																			},
																			{
																				value: 'h',
																				label: t('대문자시간'),
																			},
																			// {
																			// 	value: 'm',
																			// 	label: t('분'),
																			// },
																		]}
																		value={customRestForm.values.paidInfo.paidUnit}
																		onBlur={customRestForm.handleBlur}
																		onChange={(e) => {
																			const selectedUnit = e.target.value;
																			customRestForm.setFieldValue(
																				'paidInfo',
																				{
																					...customRestForm.values.paidInfo,
																					paidValue: selectedUnit === '' ? '' : (customRestForm.values.paidInfo.paidValue || 0),
																					paidUnit: selectedUnit,
																				},
																				false
																			);
																		}}
																	/>
																</InputGroup>
															</div>
														</div>
														{/* <div className='mb-2 text-end'>
															<small className='text-muted'>0 으로 지정시 제한없이 사용 혹은 적용됩니다</small>
														</div> */}

														{openOption2 && (
															<>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('사용 만료 기한')}</Label>
																	<div className='col-sm-8'>
																		<InputGroup>
																			<Input
																				name='end'
																				type='number'
																				value={customRestForm.values.end.value}
																				//step={0.25}
																				min={0}
																				onChange={(e) => {
																					customRestForm.setFieldValue(
																						'end',
																						{
																							...customRestForm.values.end,
																							value: e.target.value,
																						},
																						false
																					);
																				}}
																			/>
																			<Select
																				list={[
																					{
																						value: 'd',
																						label: t('대문자일'),
																					},
																					{
																						value: 'h',
																						label: t('대문자시간'),
																					},
																					{
																						value: 'm',
																						label: t('분'),
																					},
																				]}
																				value={customRestForm.values.end.unit}
																				onBlur={customRestForm.handleBlur}
																				onChange={(e) => {
																					customRestForm.setFieldValue(
																						'paidInfo',
																						{
																							...customRestForm.values.end,
																							unit: e.target.value,
																						},
																						false
																					);
																				}}
																			/>
																		</InputGroup>
																	</div>
																</div>
															</>
														)}

														{/* 	<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4'>{t('사용 가능 기간')}</Label>
															<div className='col-sm-8'>
																<InputGroup>
																	<Input
																		name='requestStart'
																		type='date'
																		onBlur={customRestForm.handleBlur}
																		invalidFeedback={customRestForm.errors.requestStart}
																		isTouched={customRestForm.touched.requestStart}
																		onChange={(e) => {
																			customRestForm.setFieldValue('requestStart', moment(e.target.value), false);
																		}}
																		//onBlur={flexChecks.handleBlur}
																		value={customRestForm.values.requestStart !== null ? moment(customRestForm.values.requestStart).format('YYYY-MM-DD') : ''}
																	/>
																	<Button
																		type='button'
																		size='sm'
																		color={customRestForm.values.requestStart !== null ? 'light' : 'info'}
																		onClick={() => {
																			customRestForm.setFieldValue('requestStart', null, false);
																		}}>
																		{t('무기한')} {customRestForm.values.requestStart === null ? ' ON' : ' OFF'}
																	</Button>
																	</InputGroup>
																	<InputGroup>
																	<Input
																		name='requestEnd'
																		type='date'
																		onBlur={customRestForm.handleBlur}
																		invalidFeedback={customRestForm.errors.requestEnd}
																		isTouched={customRestForm.touched.requestEnd}
																		onChange={(e) => {
																			customRestForm.setFieldValue('requestEnd', moment(e.target.value), false);
																		}}
																		//onBlur={flexChecks.handleBlur}
																		value={customRestForm.values.requestEnd !== null ? moment(customRestForm.values.requestEnd).format('YYYY-MM-DD') : ''}
																	/>
																	<Button
																		type='button'
																		size='sm'
																		color={customRestForm.values.requestEnd !== null ? 'light' : 'info'}
																		onClick={() => {
																			customRestForm.setFieldValue('requestEnd', null, false);
																		}}>
																		{t('무기한')} {customRestForm.values.requestEnd === null ? ' ON' : ' OFF'}
																	</Button>
										
																</InputGroup>
																	
															</div>
														</div> */}

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('분할 사용 여부')}
																<Popovers desc={
																	<>
																	{t('일단위 : 휴가신청 시 일단위로만 신청가능')} <br />
																	{t('시간단위 : 휴가신청 시 시간단위로만 신청가능')} <br />
																	{t('제한없음 : 둘다 가능')}
																	</>
																	}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1'/>
																</Popovers>
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.use === null ? 'info' : 'light'}
																		isLight={customRestForm.values.use === null}
																		onClick={() => {
																			customRestForm.setFieldValue('use', null);
																		}}>
																		{t('annualLeave.noLimit')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.use === 'DAY' ? 'info' : 'light'}
																		isLight={customRestForm.values.use === 'DAY'}
																		onClick={() => {
																			customRestForm.setFieldValue('use', 'DAY');
																		}}>
																		{t('annualLeave.dailyUnit')}
																	</Button>
																	{/* <Button
																		type='button'
																		color={customRestForm.values.use === 'HALF' ? 'info' : 'light'}
																		isLight={customRestForm.values.use === 'HALF'}
																		onClick={() => {
																			customRestForm.setFieldValue('use', 'HALF');
																		}}>
																		{t('반차')}
																	</Button> */}
																	<Button
																		type='button'
																		color={customRestForm.values.use === 'TIME' ? 'info' : 'light'}
																		isLight={customRestForm.values.use === 'TIME'}
																		onClick={() => {
																			customRestForm.setFieldValue('use', 'TIME');
																		}}>
																		{t('대문자시간')}
																	</Button>
																	{/* <Button
																		type='button'
																		color={customRestForm.values.use === 'MINUTE' ? 'info' : 'light'}
																		isLight={customRestForm.values.use === 'MINUTE'}
																		onClick={() => {
																			customRestForm.setFieldValue('use', 'MINUTE');
																		}}>
																		{t('분')}
																	</Button> */}
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('휴일 포함')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.dayOff ? 'info' : 'light'}
																		isLight={customRestForm.values.dayOff}
																		onClick={() => {
																			customRestForm.setFieldValue('dayOff', true);
																		}}>
																		{t('포함')}
																	</Button>
																	<Button
																		type='button'
																		color={!customRestForm.values.dayOff ? 'info' : 'light'}
																		isLight={!customRestForm.values.dayOff}
																		onClick={() => {
																			customRestForm.setFieldValue('dayOff', false);
																		}}>
																		{t('미포함')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('급여 지급')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.paidInfo.paidType === 'PAID' ? 'info' : 'light'}
																		isLight={customRestForm.values.paidInfo.paidType === 'PAID'}
																		onClick={() => {
																			customRestForm.setFieldValue('paidInfo', {
																				...customRestForm.values.paidInfo,
																				paidType: 'PAID',
																			});
																		}}>
																		{t('유급')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.paidInfo.paidType === 'UNPAID' ? 'info' : 'light'}
																		isLight={customRestForm.values.paidInfo.paidType === 'UNPAID'}
																		onClick={() => {
																			customRestForm.setFieldValue('paidInfo', {
																				...customRestForm.values.paidInfo,
																				paidType: 'UNPAID',
																			});
																		}}>
																		{t('무급')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.paidInfo.paidType === 'SPLIT' ? 'info' : 'light'}
																		isLight={customRestForm.values.paidInfo.paidType === 'SPLIT'}
																		onClick={() => {
																			customRestForm.setFieldValue('paidInfo', {
																				...customRestForm.values.paidInfo,
																				paidType: 'SPLIT',
																			});
																		}}>
																		{t('분할')}
																	</Button>
																</ButtonGroup>

																{customRestForm.values.paidInfo.paidType === 'SPLIT' && (
																	<>
																		<div className='row mb-2 mt-3'>
																			<Label className='form-label col-form-label col-sm-3'>{t('유급')}</Label>
																			<div className='col-sm-9'>
																				<InputGroup>
																					<Input
																						id='paidDay'
																						type='number'
																						onBlur={customRestForm.handleBlur}
																						value={customRestForm.values.paidInfo.paidDay}
																						min={0}
																						readOnly={customRestForm.values.paidInfo.paidDay == ''}
																						onChange={(e) => {
																							customRestForm.setFieldValue(
																								'paidInfo',
																								{
																									...customRestForm.values.paidInfo,
																									paidDay: e.target.value,
																								},
																								false
																							);
																						}}
																					/>
																					<InputGroupText>
																						<span className='text-muted'>{t('일')}</span>
																					</InputGroupText>
																				</InputGroup>
																			</div>
																		</div>
																		<div className='row mb-2'>
																			<Label className='form-label col-form-label col-sm-3'>{t('무급')}</Label>
																			<div className='col-sm-9'>
																				<InputGroup>
																					<Input
																						id='unPaidDay'
																						type='number'
																						onBlur={customRestForm.handleBlur}
																						value={customRestForm.values.paidInfo.unPaidDay}
																						min={0}
																						readOnly={customRestForm.values.paidInfo.unPaidDay == ''}
																						onChange={(e) => {
																							customRestForm.setFieldValue(
																								'paidInfo',
																								{
																									...customRestForm.values.paidInfo,
																									unPaidDay: e.target.value,
																								},
																								false
																							);
																						}}
																					/>
																					<InputGroupText>
																						<span className='text-muted'>{t('일')}</span>
																					</InputGroupText>
																				</InputGroup>
																			</div>
																		</div>
																	</>
																)}
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('적용 성별')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.gender === null ? 'info' : 'light'}
																		isLight={customRestForm.values.gender === null}
																		onClick={() => {
																			customRestForm.setFieldValue('gender', null);
																		}}>
																		{t('모두')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.gender === 'MALE' ? 'info' : 'light'}
																		isLight={customRestForm.values.gender === 'MALE'}
																		onClick={() => {
																			customRestForm.setFieldValue('gender', 'MALE');
																		}}>
																		{t('남성')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.gender === 'FAMLE' ? 'info' : 'light'}
																		isLight={customRestForm.values.gender === 'FAMLE'}
																		onClick={() => {
																			customRestForm.setFieldValue('gender', 'FAMLE');
																		}}>
																		{t('여성')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('증명자료 제출')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.document === null ? 'info' : 'light'}
																		isLight={customRestForm.values.document === null}
																		onClick={() => {
																			customRestForm.setFieldValue('document', null);
																		}}>
																		{t('없음')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.document === 'BEFORE' ? 'info' : 'light'}
																		isLight={customRestForm.values.document === 'BEFORE'}
																		onClick={() => {
																			customRestForm.setFieldValue('document', 'BEFORE');
																		}}>
																		{t('사전제출')}
																	</Button>
																	<Button
																		type='button'
																		color={customRestForm.values.document === 'AFTER' ? 'info' : 'light'}
																		isLight={customRestForm.values.document === 'AFTER'}
																		onClick={() => {
																			customRestForm.setFieldValue('document', 'AFTER');
																		}}>
																		{t('사후제출')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>
														{openOption1 && (
															<>
															<div className='row mb-2'>
																<Label className='form-label col-form-label col-sm-4 ps-4'>{t('휴가 부여 시점')}</Label>
																<div className='col-sm-8'>
																	<Select
																		//size='sm'
																		name='start'
																		list={
																			[
																			...[{ value: '', text: t('workDeadline.timeOfGrant')}],
																			...[{ value: 'JOIN', text: t('workDeadline.incumbentsSpecificDate')}],
																			...Array.from(Array(30).keys())
																			.filter((v) => v > 0)
																			.map((v) => {
																				return {
																					value: parseInt(v),
																					text: v === 1 ? t('입사 당해부터 부여') : t(`${v}년 차부터 부여`),
																				};
																			}),																			
																			]
																			}
																		onChange={(e) => {
																			if(e.target.value === 'JOIN') {
																				customRestForm.setFieldValue(
																					'start',
																					{													
																						unit: 'y',
																						value: e.target.value,
																						date: moment().format('MM-DD'),
																					},
																					false
																				);
																			} else {
																				customRestForm.setFieldValue(
																					'start',
																					{
																						...customRestForm.values.start,
																						value: e.target.value,
																						date: null
																					},
																					false
																				);
																			}																			
																		}}
																		value={customRestForm.values.start.value}
																	/>
																</div>
															</div>
															{customRestForm.values.start.value === 'JOIN' && (
																<div className='row mb-2'>
																<Label className='form-label col-form-label col-sm-4 ps-4'>{t('')}</Label>
																<div className='col-sm-8'>
																	<InputGroup>
																		<Select
																			list={Array.from(Array(12).keys()).map((v) => {
																				return { value: v + 1, text: v + 1 };
																			})}
																			placeholder={t('월 선택')}
																			value={((customRestForm.values.start?.date || moment().format('MM-DD')))?.split('-')[0].replace(/(^0+)/, '')}
																			onChange={(e) => {
																				let t = (customRestForm.values.start?.date || moment().format('MM-DD')).split('-');
																				t[0] = String(e.target.value).padStart(2, '0');
																				customRestForm.setFieldValue('start', {...customRestForm.values.start, date: t.join('-')});
																			}}
																		/>
																		<InputGroupText>{t('월')}</InputGroupText>
																		<Select
																			list={Array.from(Array(parseInt(moment((customRestForm.values.start?.date || moment().format('MM-DD'))?.split('-')[0], 'MM').endOf('M').format('DD'))).keys()).map((v) => {
																				return { value: v + 1, text: v + 1 };
																			})}
																			placeholder={t('일 선택')}
																			value={((customRestForm.values.start?.date || moment().format('MM-DD')))?.split('-')[1].replace(/(^0+)/, '')}
																			onChange={(e) => {
																				let t = (customRestForm.values.start?.date || moment().format('MM-DD')).split('-');
																				t[1] = String(e.target.value).padStart(2, '0');
																				customRestForm.setFieldValue('start', {...customRestForm.values.start, date: t.join('-')});
																			}}
																		/>
																		<InputGroupText>{t('일')}</InputGroupText>
																	</InputGroup>
																</div>
															</div>
															)}
															</>
														)}
													</FormGroup>

													{!vacationName && (
														<>
														<hr />
														<FormGroup label={t('소멸 정책')} className='mb-2'>
															<div className='row mb-2'>
																<Label className='form-label col-form-label col-sm-4 ps-4'>{t('휴가 소멸 정책')}</Label>
																<div className='col-sm-8'>
																	<ButtonGroup>
																		<Button
																			type='button'
																			color={customRestForm.values.isDestroyPolicy ? 'info' : 'light'}
																			isLight={customRestForm.values.isDestroyPolicy}
																			onClick={() => {
																				customRestForm.setFieldValue('isDestroyPolicy', true);
																			}}>
																			{t('사용')}
																		</Button>
																		<Button
																			type='button'
																			color={!customRestForm.values.isDestroyPolicy ? 'info' : 'light'}
																			isLight={!customRestForm.values.isDestroyPolicy}
																			onClick={() => {
																				customRestForm.setFieldValue('isDestroyPolicy', false);
																				customRestForm.setFieldValue('restDestroyMonth',0);
																				customRestForm.setFieldValue('restGraceMonth',0);
																			}}>
																			{t('미사용')}
																		</Button>
																	</ButtonGroup>

																	{customRestForm.values.isDestroyPolicy && (
																		<InputGroup className='mt-2'>
																			<Input
																				id='restDestroyMonth'
																				type='number'
																				onBlur={customRestForm.handleBlur}
																				value={customRestForm.values.restDestroyMonth}
																				//step={0.25}
																				min={0}
																				onChange={(e) => {
																					customRestForm.setFieldValue('restDestroyMonth', e.target.value, false);
																				}}
																			/>
																			<InputGroupText>
																				<span className='text-muted'>{t('workDeadline.expiresAfterMonth')}</span>
																			</InputGroupText>
																			<Select
																				name='restGraceMonth'
																				value={customRestForm.values.restGraceMonth}
																				list={Array.from(Array(12).keys()).map((v) => {
																					return { value: parseInt(v), text: v === 0 ? t('유예 기간 없음') : v + " " + t('개월 유예') };
																				})}
																				onInput={(e) => {
																					customRestForm.setFieldValue('restGraceMonth', parseInt(e.target.value));
																				}}
																			/>
																		</InputGroup>
																	)}
																</div>
															</div>
														</FormGroup>
														</>
													)}

													<hr />
													<FormGroup label={t('annualLeave.alarmSetting')} className='mb-2'>
														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.alarmSet')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customRestForm.values.alarm.restNotificationOption ? 'info' : 'light'}
																		isLight={!customRestForm.values.alarm.restNotificationOption}
																		onClick={() => {
																			customRestForm.setFieldValue('alarm', {
																				...customRestForm.values.alarm,
																				restMessage: '',
																			});
																			setRestMessages([]);
																			customRestForm.setFieldValue('alarm', {
																				...customRestForm.values.alarm,
																				restNotificationOption: true,
																			});
																		}}>
																		{t('사용')}
																	</Button>
																	<Button
																		type='button'
																		color={!customRestForm.values.alarm.restNotificationOption ? 'info' : 'light'}
																		isLight={customRestForm.values.alarm.restNotificationOption}
																		onClick={() => {
																			customRestForm.setFieldValue('alarm', {
																				...customRestForm.values.alarm,
																				restMessage: '',
																			});
																			setRestMessages([]);
																			customRestForm.setFieldValue('alarm', {
																				...customRestForm.values.alarm,
																				restNotificationOption: false,
																			});
																		}}>
																		{t('미사용')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>
														{customRestForm.values.alarm.restNotificationOption && (
															<>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.messageVariables')}</Label>
																	<div className='mb-2'>
																		<Icon icon='InfoOutline' color='dark' />
																		{t('workDeadline.noteUseVarible')}
																	</div>
																	<div className='col-sm-12'>
																		{messageVar.map((button) => (
																			<ButtonGroup key={button.key} className={'col-sm-12 mb-2'} isToolbar={false} color={'info'} onClick={() => handleCopyClick(button.key)}>
																				<Button isOutline color={'info'}>
																					{button.label}
																				</Button>
																				<Button color={'success'}>{button.value}</Button>
																			</ButtonGroup>
																		))}
																	</div>
																</div>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.messageContent')}</Label>
																	<div className='col-sm-8'>
																		<Textarea
																			id={customRestForm.values.alarm.restNotificationMessage}
																			rows={4}
																			value={customRestForm.values.alarm.restNotificationMessage}
																			onChange={(e) => {
																				customRestForm.setFieldValue('alarm', {
																					...customRestForm.values.alarm,
																					restNotificationMessage: e.target.value,
																				});
																			}}
																			placeholder={t('annualLeave.annualLeaveNote')}
																		/>
																	</div>
																</div>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.leaveOfAbsence')}</Label>
																	<div className='col-sm-8'>
																		<Input
																			type='number'
																			name='notificationDay'
																			min={1}
																			onChange={(e) => {
																				customRestForm.setFieldValue('alarm', {
																					...customRestForm.values.alarm,
																					notificationTime: Number(e.target.value),
																				});
																			}}
																			value={customRestForm.values.alarm.notificationTime}
																		/>
																		{t('workDeadline.setTimeNotification')}
																	</div>
																</div>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>{t('workDeadline.leaveReminder')}</Label>
																	<div className='col-sm-8'>
																		<Select
																			name='notificationCycle'
																			list={getAvailableNotificationCycles()}
																			onChange={(e) => {
																				customRestForm.setFieldValue('alarm', {
																					...customRestForm.values.alarm,
																					notificationCycle: e.target.value,
																				});
																			}}
																			value={customRestForm.values.alarm.notificationCycle}
																		/>
																	</div>
																</div>
															</>
														)}
													</FormGroup>
												</form>
											</OffCanvasBody>
										</OffCanvas>
										<Modal isOpen={isModalConfrim} setIsOpen={setIsModalConfrim} isCentered={true} isStaticBackdrop={true}>
											<ModalBody className='lead text-center pt-5'>
												<div>{t('삭제하시겠습니까?')}</div>
												<div>{t('삭제 이전 적용된 휴가는 변경되지 않습니다')}</div>
												{t(customRestForm.values.name)}
											</ModalBody>
											<ModalFooter className='d-flex justify-content-center'>
												<ButtonGroup isVertical>
													<Button
														type='button'
														onClick={async () => {
															await RestdayService.delete(customRestForm.values.id).then((res) => {
																if (res.data) {
																	showNotification(t('맞춤 휴가 설정'), t('휴가 설정이 삭제되었습니다.'), 'success');
																	refresh();
																	setIsModalConfrim(false);
																} else {
																	showNotification(t('맞춤 휴가 설정'), t('휴가 설정 삭제에 문제가 발생 하였습니다.'), 'danger');
																}
															});
														}}>
														{t('삭제')}
													</Button>
													<Button
														type='button'
														onClick={() => {
															customRestForm.resetForm();
															setIsModalConfrim(false);
														}}>
														{t('취소')}
													</Button>
												</ButtonGroup>
											</ModalFooter>
										</Modal>
									</ListGroup>
								) : (
									<ListGroup>
										<Card stretch shadow='none' borderSize={0}>
											<CardBody>
												<div className='row dark_boder_type'>
													{workTypeList?.map((work, index) => {
														return (
															<div key={index} className={`col-md-3 ${workTypeStatus[work.abntdWorkTypCd] ? '' : 'card_disabled'}`}>
																<Card stretch shadow='none' borderSize={1} className={'rounded'}>
																	<CardHeader className='flex-row'>
																		<CardLabel>
																			<CardTitle>
																				{work.abntdWorkTypNm}
																				{work.abntdWorkTypKind === 'CUSTOM' && (
																					<Badge className='ms-2' color='success' rounded={0}>
																						{t('맞춤')}
																					</Badge>
																				)}
																			</CardTitle>
																			{/* <CardSubTitle>
																					asdasd
																				</CardSubTitle> */}
																		</CardLabel>
																		<CardActions>
																			<Popovers
																				triger='click'
																				placement='bottom'
																				className='mw-100'
																				ref={isPopOverRef}
																				desc={
																					<ButtonGroup isVertical /* isToolbar */ size='sm'>
																						<Button
																							type='button'
																							onClick={() => {
																								isPopOverRef.current.onClick();
																								customWorkTypeForm.resetForm();
																								customWorkTypeForm.setValues({
																									...work,
																								});
																								setIsModalOpen3(true);
																							}}>
																							{t('adminMode.mainpage.modify')}
																						</Button>
																						{work.abntdWorkTypKind === 'CUSTOM' && (
																							<Button
																								type='button'
																								onClick={() => {
																									isPopOverRef.current.onClick();
																									customWorkTypeForm.resetForm();
																									customWorkTypeForm.setValues({
																										...work,
																									});
																									setIsModalConfrim(true);
																								}}>
																								{t('삭제')}
																							</Button>
																						)}
																					</ButtonGroup>
																				}>
																				<Button type='button' color='succcess' icon='ThreeDotsVertical' />
																			</Popovers>
																		</CardActions>
																	</CardHeader>
																	<CardBody>
																		<div className='checks_switch_box'>
																			<Checks
																				type='switch'
																				id={`abntdWorkTypStatus_${work.abntdWorkTypCd}`}
																				name={`abntdWorkTypStatus_${work.abntdWorkTypCd}`}
																				checked={workTypeStatus[work.abntdWorkTypCd]}
																				onChange={async (e) => {
																					try {
																						const checked = e.target.checked;
																						await WorkTypeService.updateStatus({
																							companyId: work.companyId,
																							abntdWorkTypCd: work.abntdWorkTypCd,
																							abntdWorkTypStatus: checked,
																							userId: user?.me?.id,
																						});
																						setWorkTypeStatus((prev) => ({
																							...prev,
																							[work.abntdWorkTypCd]: checked,
																						}));
																					} catch (error) {
																						console.error('상태 변경 실패:', error);
																						setWorkTypeStatus((prev) => ({
																							...prev,
																							[work.abntdWorkTypStatus]: !checked,
																						}));
																					}
																				}}
																			/>
																			<span className='txt_switch'>{workTypeStatus[work.abntdWorkTypCd] ? t('사용') : t('미사용')}</span>
																		</div>
																	</CardBody>
																</Card>
															</div>
														);
													})}
												</div>
											</CardBody>
										</Card>
										<OffCanvas isOpen={isModalOpen3} setOpen={setIsModalOpen3}> 
											<OffCanvasHeader setOpen={setIsModalOpen3}> 
												<OffCanvasTitle>{t('맞춤 근무유형 설정')}</OffCanvasTitle> 
											</OffCanvasHeader>
											<OffCanvasBody>
												<div className='text-end'>
													<Button
														type='button'
														color='info'
														onClick={() => {
															customWorkTypeForm.submitForm();
														}}>
														{customWorkTypeForm.values.abntdWorkTypCd === 0 ? t('저장') : t('adminMode.mainpage.modify')}
													</Button>
												</div>
												<form id='customWorkTypeForm' onSubmit={customWorkTypeForm.handleSubmit}>
													<FormGroup label={t('기본 설정')} className='mb-4'>
														<Input
															type='text'
															name='abntdWorkTypNm'
															value={t(customWorkTypeForm.values.abntdWorkTypNm)}
															invalidFeedback={customWorkTypeForm.errors.abntdWorkTypNm}
															isTouched={customWorkTypeForm.touched.abntdWorkTypNm}
															onBlur={customWorkTypeForm.handleBlur}
															onChange={(e) => {
																customWorkTypeForm.setFieldValue('abntdWorkTypNm', e.target.value, false);
															}}
															placeholder={t('근무유형명')}
															className='mb-2'
														/>
														<Input
															type='text'
															name='abntdWorkTypCd'
															value={customWorkTypeForm.values.abntdWorkTypCd}
															onChange={(e) => {
																customWorkTypeForm.setFieldValue('abntdWorkTypCd', e.target.value, false);
															}}
															placeholder={t('근무유형 코드')}
															className='mb-2'
															style={{ display: 'none' }} // 숨김 처리
														/>
														<Textarea
															rows={2}
															value={customWorkTypeForm.values.abntdWorkTypDtlXpl || ''}
															onChange={(e) => {
																customWorkTypeForm.setFieldValue('abntdWorkTypDtlXpl', e.target.value, false);
															}}
															placeholder={t('근무유형 설명')}
														/>
														<div className='mt-3'>
															{/* 효빈 250507 수정 */}
															<FileUpload
																accept='image/jpeg,image/jpg,image/png,image/gif'
																onFileChange={(e) => {
																	const r = new FileReader();
																	r.onload = (e) => {
																		customWorkTypeForm.setFieldValue('abntdWorkTypFileNm', e.target.result);
																	};

																	r.readAsDataURL(e.target.files[0]);
																}}
															/>
															{customWorkTypeForm.values.abntdWorkTypFileNm && (
																<div className='img_preview_box'>
																	<img src={customWorkTypeForm.values.abntdWorkTypFileNm}
																		alt='preview'
																	/>
																</div>
															)}
														</div>
													</FormGroup>

													<FormGroup label={t('상세 설정')} className='mb-4'>
														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('단축근로 여부')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdShotnWorkEnx ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdShotnWorkEnx}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdShotnWorkEnx', true);
																		}}>
																		{t('사용')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdShotnWorkEnx ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdShotnWorkEnx}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdShotnWorkEnx', false);
																			customWorkTypeForm.setFieldValue('abntdShotnWorkKindCd', {
																				'preg': false,
																				'child': false,
																				'fmly': false
																			});
																		}}>
																		{t('미사용')}
																	</Button>
																</ButtonGroup>

																{customWorkTypeForm.values.abntdShotnWorkEnx && (
																	<CustomSelectChk className='mt-2' options={shorWorkOptions} defaultTxt='단축근로 종류를 선택하세요' >
																		{({ option }) => (
																			<Checks
																				key={option.id}
																				type='check'
																				label={option.label}
																				// value={}
																				checked={customWorkTypeForm.values.abntdShotnWorkKindCd[option.value] || false}
																				onChange={(e) => {
																					const current = customWorkTypeForm.values.abntdShotnWorkKindCd[option.value];
																					customWorkTypeForm.setFieldValue(`abntdShotnWorkKindCd.${option.value}`, !current);
																				}}
																			></Checks>
																		)}
																	</CustomSelectChk>
																)}
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('취소신청 가능여부')}
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdRtrcnAplyYn ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdRtrcnAplyYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdRtrcnAplyYn', true);
																		}}>
																		{t('사용')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdRtrcnAplyYn ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdRtrcnAplyYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdRtrcnAplyYn', false);
																		}}>
																		{t('미사용')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('수정신청 가능여부')}
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdMdfcnAplyYn ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdMdfcnAplyYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdMdfcnAplyYn', true);
																		}}>
																		{t('사용')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdMdfcnAplyYn ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdMdfcnAplyYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdMdfcnAplyYn', false);
																		}}>
																		{t('미사용')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('급여 지급')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdPayGiveFrmCd === 'PAID' ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdPayGiveFrmCd === 'PAID'}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdPayGiveFrmCd', 'PAID');
																		}}>
																		{t('유급')}
																	</Button>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdPayGiveFrmCd === 'UNPAID' ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdPayGiveFrmCd === 'UNPAID'}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdPayGiveFrmCd', 'UNPAID');
																		}}>
																		{t('무급')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>
													</FormGroup>

													<hr />

													<FormGroup label={t('근무신청 설정')} className='mb-4'>
														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('증명자료 제출')}</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdEviDataSbmsnClCd === null ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdEviDataSbmsnClCd === null}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdEviDataSbmsnClCd', null);
																		}}>
																		{t('없음')}
																	</Button>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdEviDataSbmsnClCd === 'BEFORE' ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdEviDataSbmsnClCd === 'BEFORE'}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdEviDataSbmsnClCd', 'BEFORE');
																		}}>
																		{t('사전제출')}
																	</Button>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdEviDataSbmsnClCd === 'AFTER' ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdEviDataSbmsnClCd === 'AFTER'}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdEviDataSbmsnClCd', 'AFTER');
																		}}>
																		{t('사후제출')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('근무지 노출 여부')}
																<Popovers desc={t('근무신청 시 근무지를 입력하는 영역이 노출되는지 지정')}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1' />
																</Popovers>
															</Label>
															<div className='col-sm-8'>
															<ButtonGroup size=''>
																<Button
																	type='button'
																	color={customWorkTypeForm.values.abntdPowkExpsrYn ? 'info' : 'light'}
																	isLight={customWorkTypeForm.values.abntdPowkExpsrYn}
																	onClick={() => {
																		customWorkTypeForm.setFieldValue('abntdPowkExpsrYn', true);
																	}}>
																	{t('노출')}
																</Button>
																<Button
																	type='button'
																	color={!customWorkTypeForm.values.abntdPowkExpsrYn ? 'info' : 'light'}
																	isLight={!customWorkTypeForm.values.abntdPowkExpsrYn}
																	onClick={() => {
																		customWorkTypeForm.setFieldValue('abntdPowkExpsrYn', false);
																	}}>
																	{t('미노출')}
																</Button>
															</ButtonGroup>
															</div>
														</div>

														{customWorkTypeForm.values.abntdWorkTypNm !== '연장근무' && customWorkTypeForm.values.abntdWorkTypNm !== '특근' && (
															<>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('단위기간 지정 여부')}
																		<Popovers desc={t('근무신청 시 한번에 신청가능한 일자를 고정시킬것인지 지정')}>
																			<Icon icon='InfoOutline' color='dark' className='ms-1' />
																		</Popovers>
																	</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup size=''>
																			<Button
																				type='button'
																				color={customWorkTypeForm.values.abntdUniPrdAplyYn ? 'info' : 'light'}
																				isLight={customWorkTypeForm.values.abntdUniPrdAplyYn}
																				onClick={() => {
																					customWorkTypeForm.setFieldValue('abntdUniPrdAplyYn', true);
																				}}>
																				{t('지정')}
																			</Button>
																			<Button
																				type='button'
																				color={!customWorkTypeForm.values.abntdUniPrdAplyYn ? 'info' : 'light'}
																				isLight={!customWorkTypeForm.values.abntdUniPrdAplyYn}
																				onClick={() => {
																					customWorkTypeForm.setFieldValue('abntdUniPrdAplyYn', false);
																					customWorkTypeForm.setFieldValue('abntdUniPrdDay', 0);
																					customWorkTypeForm.setFieldValue('abntdUniPrdClCd', 'w');
																				}}>
																				{t('미지정')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div>

																{customWorkTypeForm.values.abntdUniPrdAplyYn && (
																	<div className='row mb-2'>
																		<Label className='form-label col-form-label col-sm-4 ps-4'>
																			{t('단위기간')}
																		</Label>
																		<div className='col-sm-8'>
																			<InputGroup>
																				<Input
																					id='abntdUniPrdDay'
																					type='number'
																					onBlur={customWorkTypeForm.handleBlur}
																					value={customWorkTypeForm.values.abntdUniPrdDay}
																					min={0}
																					onChange={(e) => {
																						const val = e.target.value;
																						customWorkTypeForm.setFieldValue('abntdUniPrdDay', val);
																					}}
																				/>
																				<Select
																					list={[
																						{
																							value: 'w',
																							label: t('주'),
																						},
																						{
																							value: 'm',
																							label: t('대문자월'),
																						},
																					]}
																					value={customWorkTypeForm.values.abntdUniPrdClCd}
																					onBlur={customWorkTypeForm.handleBlur}
																					onChange={(e) => {
																						const selectedUnit = e.target.value;
																						customWorkTypeForm.setFieldValue('abntdUniPrdClCd', selectedUnit);
																					}}
																				/>
																			</InputGroup>
																		</div>
																	</div>
																)}
															</>
														)}
													</FormGroup>

													{customWorkTypeForm.values.abntdWorkTypNm !== '연장근무' && customWorkTypeForm.values.abntdWorkTypNm !== '특근' && (
														<>
															<hr />

															<FormGroup label={t('날짜선택 설정')} className='mb-4'>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('선택기간 유형')}
																		<Popovers desc={
																			<>
																				{t('단일 : 근무신청 시 날짜를 하루만 선택가능')} <br />
																				{t('FROM~TO : 근무신청 시 날짜를 여러날 선택가능')}
																			</>
																		}>
																			<Icon icon='InfoOutline' color='dark' className='ms-1'/>
																		</Popovers>
																	</Label>
																	<div className='col-sm-8'>
																			<Select
																				placeholder={t('선택기간 유형을 선택하세요')}
																				list={[
																					{
																						value: 'ONEDAY',
																						label: t('단일'),
																					},
																					{
																						value: 'FROMTO',
																						label: t('FROM ~ TO'),
																					},
																				]}
																				value={customWorkTypeForm.values.abntdChcPrdTypCd || ''}
																				invalidFeedback={customWorkTypeForm.errors.abntdChcPrdTypCd}
																				isTouched={customWorkTypeForm.touched.abntdChcPrdTypCd}
																				onBlur={customWorkTypeForm.handleBlur}
																				onChange={(e) => {
																					customWorkTypeForm.setFieldValue('abntdChcPrdTypCd', e.target.value);
																				}}
																			/>
																	</div>
																</div>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('선택날짜 유형')}
																		<Popovers desc={
																			<>
																				{t('휴일 : 근무신청 시 날짜를 휴일만 선택가능')} <br />
																				{t('근무일 : 근무신청 시 날짜를 근무일만 선택가능')} <br />
																				{t('제한없음 : 휴일, 근무일 둘다 선택가능')}
																			</>
																		}>
																			<Icon icon='InfoOutline' color='dark' className='ms-1'/>
																		</Popovers>
																	</Label>
																	<div className='col-sm-8'>
																		<ButtonGroup size=''>
																			<Button
																				type='button'
																				color={customWorkTypeForm.values.abntdChcDateTypCd === null ? 'info' : 'light'}
																				isLight={customWorkTypeForm.values.abntdChcDateTypCd === null}
																				onClick={() => {
																					customWorkTypeForm.setFieldValue('abntdChcDateTypCd', null);
																				}}>
																				{t('제한없음')}
																			</Button>
																			<Button 
																				type='button'
																				color={customWorkTypeForm.values.abntdChcDateTypCd === 'HOLIDAY' ? 'info' : 'light'}
																				isLight={customWorkTypeForm.values.abntdChcDateTypCd === 'HOLIDAY'}
																				onClick={() => {
																					customWorkTypeForm.setFieldValue('abntdChcDateTypCd', 'HOLIDAY');
																				}}>
																				{t('휴일')}
																			</Button>
																			<Button
																				type='button'
																				color={customWorkTypeForm.values.abntdChcDateTypCd === 'WORKDAY' ? 'info' : 'light'}
																				isLight={customWorkTypeForm.values.abntdChcDateTypCd === 'WORKDAY'}
																				onClick={() => {
																					customWorkTypeForm.setFieldValue('abntdChcDateTypCd', 'WORKDAY');
																				}}>
																				{t('근무일')}
																			</Button>
																		</ButtonGroup>
																	</div>
																</div>
															</FormGroup>

															<hr />

															<FormGroup label={t('시간선택 설정')} className='mb-4'>
																<div className='row mb-2'>
																	<Label className='form-label col-form-label col-sm-4 ps-4'>
																		{t('시간 설정')}
																		<Popovers desc={
																			<>
																				{t('출퇴근시간 선택 : 근무신청 시 30분단위로 되어있는 시간중 하나를 선택')} <br />
																				<span style={{ marginLeft: '7em' }}>{t('--> 소정근로시간만큼 시간이 자동 지정됨')}</span><br />
																				{t('FROM~TO : 근무신청 시 FROM 시간, TO 시간을 각각 지정')}
																			</>
																		}>
																			<Icon icon='InfoOutline' color='dark' className='ms-1'/>
																		</Popovers>
																	</Label>
																	<div className='col-sm-8'>
																		<Select
																			placeholder={t('시간설정 종류를 선택하세요')}
																			list={[
																				{
																					value: 'COMMUTE',
																					label: t('출퇴근시간 선택'),
																				},
																				{
																					value: 'FROMTO',
																					label: t('FROM ~ TO'),
																				},
																			]}
																			value={customWorkTypeForm.values.abntdTmChcClCd || ''}
																			invalidFeedback={customWorkTypeForm.errors.abntdTmChcClCd}
																			isTouched={customWorkTypeForm.touched.abntdTmChcClCd}
																			onBlur={customWorkTypeForm.handleBlur}
																			onChange={(e) => {
																				customWorkTypeForm.setFieldValue('abntdTmChcClCd', e.target.value);
																			}}
																		/>
																	</div>
																</div>
															</FormGroup>
														</>
													)}
													<hr />

													<FormGroup label={t('고급 설정')} className='mb-4'>
														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('결재시 달력노출')}
																<Popovers desc={t('결재자 승인창에 근무신청일자들이 달력으로 표기됨')}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1' />
																</Popovers>
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdAtrzCaldrExpsrYn ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdAtrzCaldrExpsrYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdAtrzCaldrExpsrYn', true);
																		}}>
																		{t('노출')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdAtrzCaldrExpsrYn ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdAtrzCaldrExpsrYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdAtrzCaldrExpsrYn', false);
																		}}>
																		{t('미노출')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('스케쥴 반영여부')}
																<Popovers desc={t('근무신청 후 결재 승인 시 스케쥴 관리 메뉴에 반영됨')}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1' />
																</Popovers>
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdSchdlRfltYn ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdSchdlRfltYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdSchdlRfltYn', true);
																		}}>
																		{t('노출')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdSchdlRfltYn ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdSchdlRfltYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdSchdlRfltYn', false);
																		}}>
																		{t('미노출')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>

														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>
																{t('유연근무현황 노출여부')}
																<Popovers desc={t('해당 근무유형이 유연근무현황 메뉴에 노출됨')}>
																	<Icon icon='InfoOutline' color='dark' className='ms-1' />
																</Popovers>
															</Label>
															<div className='col-sm-8'>
																<ButtonGroup size=''>
																	<Button
																		type='button'
																		color={customWorkTypeForm.values.abntdAgwrkExpsrYn ? 'info' : 'light'}
																		isLight={customWorkTypeForm.values.abntdAgwrkExpsrYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdAgwrkExpsrYn', true);
																		}}>
																		{t('노출')}
																	</Button>
																	<Button
																		type='button'
																		color={!customWorkTypeForm.values.abntdAgwrkExpsrYn ? 'info' : 'light'}
																		isLight={!customWorkTypeForm.values.abntdAgwrkExpsrYn}
																		onClick={() => {
																			customWorkTypeForm.setFieldValue('abntdAgwrkExpsrYn', false);
																		}}>
																		{t('미노출')}
																	</Button>
																</ButtonGroup>
															</div>
														</div>
													</FormGroup>
												</form>
											</OffCanvasBody>
										</OffCanvas>
										<Modal isOpen={isModalConfrim} setIsOpen={setIsModalConfrim} isCentered={true} isStaticBackdrop={true}>
											<ModalBody className='lead text-center pt-5'>
												<div>{t('삭제하시겠습니까?')}</div>
												<div>{t('삭제한 근무유형과 관련된 근무데이터는 변경되지 않습니다')}</div>
												{t(customWorkTypeForm.values.abntdWorkTypNm)}
											</ModalBody>
											<ModalFooter className='d-flex justify-content-center'>
												<ButtonGroup isVertical>
													<Button
														type='button'
														onClick={async () => {
															// values.userId = user?.me?.id;
															await WorkTypeService.delete({
																companyId : customWorkTypeForm.values.companyId,
																abntdWorkTypCd : customWorkTypeForm.values.abntdWorkTypCd
																}).then((res) => {
																if (res?.result) {
																	showNotification(t('근무 유형'), t('근무유형이 삭제되었습니다.'), 'success');
																	refresh();
																	setIsModalConfrim(false);
																} else {
																	showNotification(t('근무 유형'), t('근무유형 삭제에 문제가 발생 하였습니다.'), 'danger');
																}
															});
														}}>
														{t('삭제')}
													</Button>
													<Button
														type='button'
														onClick={() => {
															customRestForm.resetForm();
															setIsModalConfrim(false);
														}}>
														{t('취소')}
													</Button>
												</ButtonGroup>
											</ModalFooter>
										</Modal>
									</ListGroup>
								)}
							</CardBody>
						</Card>
					);
				})}

			{/* 마감 추가 모달 */}
			<AddDeadlineModal
				ref={addDeadlineRef}
				isOpen={deadlineModalOpen}
				setIsOpen={setDeadlineModalOpen}
				setDupPeriodModalOpen={setDupPeriodModalOpen}
				setSelectUserModalOpen={setSelectUserModalOpen}
				refresh={refresh}
				setIsLoading={setIsLoading}
				isLoading={isLoading}
			/>

			{/* 마감 대상 선택/변경 모달 */}
			<WorkDeadlineUserListModal
				isOpen={selectUserModalOpen}
				setIsOpen={setSelectUserModalOpen}
				userList={deadlineForUpdate ? deadlineForUpdate.userDeadlines : addDeadlineRef?.current?.userList ? addDeadlineRef?.current?.userList : []}
				setUserList={addDeadlineRef?.current?.setUserList}
				deadlineForUpdate={deadlineForUpdate}
				setDupPeriodModalOpen={setDupPeriodModalOpen}
				refresh={refresh}
				setIsLoading={setIsLoading}
				isLoading={isLoading}
			/>

			{/* 마감기간 중복 알림 모달 */}
			<DupPeriodNoticeModal
				isOpen={dupPeriodModalOpen}
				setIsOpen={setDupPeriodModalOpen}
			/>

			{/* 휴가 정책 변경 모달 */}
			<VacationPolicyConfirmModal
				isOpen={isOpenVacationPolicyConfirmModal}
				setIsOpen={setIsOpenVacationPolicyConfirmModal}
				restCompanyForm={restCompanyForm}
			/>

			{/* 선택 지정 / 이월연차 기준 설정 모달 */}
			{restCompanyForm.values.restScope && (
				<RestSettingModal
					restScopeModalOpen={restScopeModalOpen}
					setRestScopeModalOpen={setRestScopeModalOpen}
					restDepartments={restDepartments}
					originData={originUserData}
					getRefresh={getUsers}
					totalCount={userTotalCount}
					departmentTree={departmentTree}
				/>
			)}
		</div>
	);
});

// <SortableTree
// 	treeData={treeData}
// 	maxDepth={1}
// 	onChange={(nodes) => setTreeData(nodes)}
// 	theme={FileExplorerTheme}
// 	onDragStateChanged={async (node) => {
// 		if (!node.isDragging) {
// 			await RankService.updateRankTree({
// 				ranks: treeData,
// 			})
// 				.then(async (res) => {
// 					await RankService.getSortTreeRank(
// 						company.id,
// 					).then((response) => {
// 						const newArray = response.data.filter(
// 							(d) => d.title != '',
// 						);
// 						setTreeData(newArray);
// 					});
// 				})
// 				.catch((err) => {});
// 		}
// 	}}
// 	generateNodeProps={(nodes) => {
// 		let nodeProps = {
// 			//buttons: [activeTab === "rank" && <span>{nodes.node.order+1}</span>],
// 			title: (
// 				<div className='w-100'>
// 					<InputGroup>
// 						<Button
// 							/* isOutline */
// 							style={{ cursor: 'grab' }}
// 							color='light'
// 							isDisable>
// 							{nodes.node.order}
// 						</Button>
// 						<Input
// 							color='light'
// 							style={{ cursor: 'grab' }}
// 							value={`${nodes.node.title}`}
// 							disabled={true}
// 						/>
// 						<Button
// 							/* isOutline */
// 							style={{ cursor: 'grab' }}
// 							color='light'
// 							icon={'ArrowDownUp'}
// 							isDisable
// 						/>
// 					</InputGroup>
// 				</div>
// 			),
// 			onClick: (e) => {
// 				e.preventDefault();
// 				setDeleteRankUnit(nodes);
// 				setUpdateRankUnit(nodes);
// 			},
// 		};

// 		return nodeProps;
// 	}}
// />

export default CompamySettingRightCard;
