import { useCallback, useEffect, useRef, useState } from 'react';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import useMinimizeAside from '../../../hooks/useMinimizeAside';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import Card, { CardActions, CardBody, CardHeader, CardSubTitle, CardTitle, CardLabel } from '../../../components/bootstrap/Card';
import { adminsMenu } from '../../../menu';
import useDarkMode from '../../../hooks/useDarkMode';
import { useTranslation } from 'react-i18next';
import { useMst } from '../../../models';

import Popovers from '../../../components/bootstrap/Popovers';
import GroupService from '../../../services/GroupService';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Icon from '../../../components/icon/Icon';
import moment from 'moment';
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import CompanyService from '../../../services/CompanyService';

import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import DepartmentService from '../../../services/DepartmentService';

import Badge from '../../../components/bootstrap/Badge';
import Input from '../../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import UserService from '../../../services/UserService';
import Alert from '../../../components/bootstrap/Alert';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Select from '../../../components/bootstrap/forms/Select';
import Select2 from 'react-select';
import { Options } from '../../../components/bootstrap/Option';
import Tooltips from '../../../components/bootstrap/Tooltips';
import showNotification from '../../../components/extras/showNotification';
import Label from '../../../components/bootstrap/forms/Label';
import Breadcrumb, { BreadcrumbItem } from '../../../components/bootstrap/Breadcrumb';
import { CellMeasurerCache, createMasonryCellPositioner } from 'react-virtualized';

import SortableTree, { toggleExpandedForAll } from '@nosferatu500/react-sortable-tree';
import FileExplorerTheme from '@nosferatu500/theme-file-explorer';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import ChecksNew from '../../../components/bootstrap/forms/Checksnew';
import IconUserSettingsLine from "../../../assets/img/icon/user-settings-line.svg";
import IconCalander from "../../../assets/img/icon/calander.svg";
import IconGroups from "../../../assets/img/icon/groups.svg";
import config from '../../../config';
import MapComponent from './components/MapComponent';
import { renameMultipleRootKeys } from '../../../helpers/helpers';
// import Avatar from 'react-avatar';
import { MAX_LENGTH } from '../../../helpers/constant';

const cache = new CellMeasurerCache({
	defaultWidth: 400,
	defaultHeight: 300,
	fixedWidth: true,
});

let cellPositioner = new createMasonryCellPositioner({
	cellMeasurerCache: cache,
	columnCount: 3,
	columnWidth: 400,
	spacer: 10,
});

const WorkingGroup = () => {
	useMinimizeAside();
	const navigate = useNavigate();

	const [columnWidth, setColumnWidth] = useState(400);
	const [columnCount, setColumnCount] = useState(3);

	const searchRef = useRef(null);
	const listRef = useRef(null);

	const [timer, setTimer] = useState(0); // 디바운싱 타이머

	const { company, user } = useMst();
	const { t } = useTranslation();
	const { darkModeStatus } = useDarkMode();

	const [, updateState] = useState(); // 상태 변수는 선언하지 않는다
	const forceUpdate = useCallback(() => updateState({}), []);

	const [groups, setGroups] = useState([]);
	const [filterGroups, setFilterGroups] = useState([]);
	const [isOpenFindUser, setIsOpenFindUser] = useState(false); // 사용자 관리 모달

	const [selectGroup, setSelectGroup] = useState({});
	const [isOpenaddGroup, setIsOpenAddGroup] = useState(false); // 그룹 관리 모달

	const [allUsers, setAllUsers] = useState([]);
	const [selectedUserIds, setSelectedUserIds] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);

	const [viewType, setViewType] = useState('');
	const [checkWorkTimeText, setCheckWorkTimeText] = useState({});

	const [isErrorValid, setErrorValid] = useState([]);
	const [nullRest, setNullRest] = useState([]);
	const [searchUsers, setSearchUsers] = useState([]); // 검색 유저
	const [treeUser, setTreeUser] = useState([]);
	const [departmentTree, setDepartmentTree] = useState([]);
	const [workSystems, setWorkSystems] = useState([]);
	const [workSystemsSelect, setWorkSystemSelect] = useState([]);
	const [workSystem, setWorkSystem] = useState({});
	const [settingArea, setSettingArea] = useState([]);
	const [areas, setAreas] = useState({});

	const getDepartUser = useCallback(
		async (departId) => {

			// setSearchUsers([]);
			await UserService.listBy('department', departId, company.get.id)
				.then((res) => {
					if (res?.data) {
						setSearchUsers(res.data);
					}
				})
				.catch(() => {
					setSearchUsers([]);
				});
		},
		[company]
	);

	const convertMinsToHrsMins = useCallback((mins) => {
		let h = Math.floor(mins / 3600);
		let m = Math.floor((mins % 3600) / 60);
		let s = Math.floor(mins % 60);
		//let h = Math.floor(mins / (60 * 60));
		//let m = mins % (60);
		h = h < 10 ? '0' + h : h;
		m = m < 10 ? '0' + m : m;
		return `${h}:${m}`;
	}, []);

	const convertMinsToHrsMinsString = useCallback((mins) => {
		let h = Math.floor(mins / 3600);
		let m = Math.floor((mins % 3600) / 60);
		let s = Math.floor(mins % 60);
		//let h = Math.floor(mins / (60 * 60));
		//let m = mins % (60);
		// h = h < 10 ? '0' + h : h;
		// m = m < 10 ? '0' + m : m;
		return `${h != '00' ? h + t('시간') : ''} ${m != '00' ? m + t('분') : ''}`;
	}, []);

	const validate = (values) => {

		const errors = {};

		//숫자만  유효성 검사
		let checkNum = /^[0-9]+$/;

		if (values.isHolidayWork === false) {
			flexChecks.setFieldValue('isHolidayWorkOver', false, false);
		}

		if (!values.workSystemId) {
			errors.workSystemId = t('근로제를 선택해주세요');
		}

		if (!values.name || values.name.trim() === '') {
			errors.name = t('그룹명을 입력해주세요');
		} else if (values.name === t('본사')) {
			errors.name = t('사용할수 없는 그룹명입니다');
		}
		else if (values.name.length > MAX_LENGTH) {
			errors.name = t('common.validation.fieldExceedsCharacters',{
				fieldName: t('근무그룹 이름'),
				maxLength: MAX_LENGTH
			});
		}

		if (!selectGroup.id) {
			if (['본사', '기본','default','mặc định', 'head office', 'trụ sở chính'].includes(values.name?.toString()?.toLowerCase())) {
				errors.name = t('사용할수 없는 그룹명입니다');
			}
		}

		if (!isWorkSystemDefaultType(values.workSystem)) {
			if (!values.startAt) {
				errors.startAt = t('근무그룹 시작일자를 선택해주세요');
			}

			if (values.workDay.length === 0) {
				errors.workDay = t('근무일을 지정해주세요');
			}

			if ((values.workTime.length > 0 && values.workSystem !== '자율근무제') && isWorkSystemDefaultType(values.workSystem)) {
				if (values.workTime[values.workTime.length - 1][0] === '' || values.workTime[values.workTime.length - 1][1] === '') {
					errors.workTime = t('출/퇴근 시간을 지정해주세요');
				}
			}

			//근무시간 범위 이탈
			const [requestStartTime, requestEndTime] = values.requestWorkTime;
			const reqOneDay = moment(requestStartTime, 'HH:mm') >= moment(requestEndTime, 'HH:mm') ? 1 : 0;

			if ((values.workSystem !== '자율근무제' && values.workTime[0][0] !== '' && values.workTime[0][1] !== '') && isWorkSystemDefaultType(values.workSystem)) {
				values.workTime.forEach(([startTime, endTime]) => {
					if (startTime !== '' && endTime !== '') {
						let workOneDay = moment(endTime, 'HH:mm') <= moment(startTime, 'HH:mm') ? 1 : 0;
						const now = moment();
						let reqStartTime = now.format('YYYY-MM-DD ') + moment(requestStartTime, 'HH:mm').format('HH:mm');
						let reqEndTime = now.format('YYYY-MM-DD ') + moment(requestEndTime, 'HH:mm').format('HH:mm'); // moment(requestEndTime, format);
						let workStartTime = now.format('YYYY-MM-DD ') + moment(startTime, 'HH:mm').format('HH:mm'); // moment(startTime, format);
						let workEndTime = now.format('YYYY-MM-DD ') + moment(endTime, 'HH:mm').format('HH:mm'); //moment(endTime, format);

						if (reqOneDay === 1) {
							reqEndTime = moment(reqEndTime, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');
						}

						if (workOneDay === 1) {
							workEndTime = moment(workEndTime, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');
						}

						if (
							(moment(workStartTime).isBetween(reqStartTime, reqEndTime) === false && moment(reqStartTime).isSame(workStartTime) === false) ||
							(moment(workEndTime).isBetween(reqStartTime, reqEndTime) === false && moment(workEndTime).isSame(reqEndTime) === false)
						) {
							errors.workTime = t('근무시간이 근무 가능시간 범위를 벗어났습니다.');
						}
					}
				});
			}

			//휴게시간 범위 이탈

			let workSysNullChk =
				values.workSystem === '자율근무제'
					? values.requestWorkTime[0] !== '' && values.requestWorkTime[1] !== '' && values.workTime[0][0] === ''
					: values.workTime[0][0] !== '' || values.workTime[0][1] !== '';
			if (workSysNullChk) {
				let workTimes = values.workSystem === '자율근무제' ? [values.requestWorkTime] : values.workTime;
				values.workDay.forEach((v) => {
					values.restTime[parseInt(v) - 1].forEach((vv, i) => {
						workTimes.forEach(([compareStartTime, compareEndTime], index) => {
							if (values.restTime[parseInt(v) - 1][i][0] !== '' || values.restTime[parseInt(v) - 1][1] !== '') {
								if (moment(values.restTime[parseInt(v) - 1][i][0], 'HH:mm', true).isValid() === true && moment(values.restTime[parseInt(v) - 1][i][1], 'HH:mm', true).isValid() === true) {
									let workOneDay = moment(compareEndTime, 'HH:mm') <= moment(compareStartTime, 'HH:mm') ? 1 : 0;
									const now = moment();
									let restStartTime = now.format('YYYY-MM-DD ') + moment(values.restTime[parseInt(v) - 1][i][0], 'HH:mm').format('HH:mm');
									let restEndTime = now.format('YYYY-MM-DD ') + moment(values.restTime[parseInt(v) - 1][i][1], 'HH:mm').format('HH:mm');
									let workStartTime = now.format('YYYY-MM-DD ') + moment(compareStartTime, 'HH:mm').format('HH:mm');
									let workEndTime = now.format('YYYY-MM-DD ') + moment(compareEndTime, 'HH:mm').format('HH:mm');
									let midWork = now.format('YYYY-MM-DD ') + moment('00:00', 'HH:mm').format('HH:mm');

									let plusWork = moment(workEndTime, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');

									if (workOneDay === 1) {
										let plusRestStart = moment(restStartTime, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');
										let plusRestEnd = moment(restEndTime, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');
										let nextMidWork = moment(midWork, 'YYYY-MM-DD HH:mm').add(1, 'days').format('YYYY-MM-DD HH:mm');

										if (
											((moment(plusRestStart).isBetween(midWork, plusWork) === false && moment(plusRestStart).isSame(plusWork) === false) ||
												(moment(plusRestEnd).isBetween(midWork, plusWork) === false && moment(plusRestEnd).isSame(plusWork) === false)) &&
											((moment(restStartTime).isBetween(workStartTime, nextMidWork) === false && moment(restStartTime).isSame(workStartTime) === false) ||
												(moment(restEndTime).isBetween(workStartTime, nextMidWork) === false && moment(restEndTime).isSame(workEndTime) === false)) &&
											((moment(restStartTime).isBetween(workStartTime, plusWork) === false && moment(restStartTime).isSame(plusWork) === false) ||
												(moment(plusRestEnd).isBetween(workStartTime, plusWork) === false && moment(plusRestEnd).isSame(plusWork) === false))
										) {
											errorIndex = parseInt(v) - 1;
											errorIndexDown = i;
											errorIndexArr.push([errorIndex, errorIndexDown]);
											duplic = [...new Set(errorIndexArr.map(JSON.stringify))].map(JSON.parse);
											setErrorValid(duplic);
											values.workSystem === '자율근무제' ? (errors.restTime = t('휴식시간이 근무 가능시간 범위를 벗어났습니다.')) : (errors.restTime = t('휴식시간이 근무시간 범위를 벗어났습니다.'));
										}
									} else {
										if (
											(moment(restStartTime).isBetween(workStartTime, workEndTime) === false && moment(workStartTime).isSame(restStartTime) === false) ||
											(moment(restEndTime).isBetween(workStartTime, workEndTime) === false && moment(workEndTime).isSame(restEndTime) === false)
										) {
											errorIndex = parseInt(v) - 1;
											errorIndexDown = i;
											errorIndexArr.push([errorIndex, errorIndexDown]);
											duplic = [...new Set(errorIndexArr.map(JSON.stringify))].map(JSON.parse);
											setErrorValid(duplic);
											values.workSystem === '자율근무제' ? (errors.restTime = t('휴식시간이 근무 가능시간 범위를 벗어났습니다.')) : (errors.restTime = t('휴식시간이 근무시간 범위를 벗어났습니다.'));
										}
									}
								}
							} else {
								errorIndex = parseInt(v) - 1;
								errorIndexDown = i;
								errorIndexArr.push([errorIndex, errorIndexDown]);
								duplic = [...new Set(errorIndexArr.map(JSON.stringify))].map(JSON.parse);
								setErrorValid(duplic);
								values.workSystem === '자율근무제' ? (errors.restTime = t('휴식시간이 근무 가능시간 범위를 벗어났습니다.')) : (errors.restTime = t('휴식시간이 근무시간 범위를 벗어났습니다.'));
							}
						});
					});
				});
			}

			//근무시간 초과알림
			if (flexChecks.values.workTimeOver) {
				if (values.workTimeOver.length > 0) {
					if (values.workTimeOver[0] !== '' || values.workTimeOver[1] !== '') {
						if (!checkNum.test(values.workTimeOver[0]) || !checkNum.test(values.workTimeOver[1])) {
							errors.workTimeOver = t('숫자만 입력가능합니다.');
						} else if ((values.workTimeOver[0] !== '' && values.workTimeOver[1] === '') || (values.workTimeOver[1] !== '' && values.workTimeOver[0] === '')) {
							errors.workTimeOver = t('빈칸을 채워주세요.');
						}
					}
				}
			}
		}

		if (values.startAt && values.endAt) {
			if (moment(values.startAt).isAfter(moment(values.endAt))) {
				errors.startAt = t('workDeadline.endDateCannotBeLessThanStartDate')
			}
		}

		if (!values.areaId) {
			errors.areaId = t('출/퇴근 근무지를 입력해주세요');
		}


		// if(Object.keys(errors).length > 0)
		// 	showNotification('근무 그룹 추가', '입력값을 확인해주세요', 'danger');


		return errors;
	};

	const flexChecks = useFormik({
		initialValues: {
			id: null,
			companyId: company.get.id,
			name: '',
			startAt: moment(),
			endAt: null,
			workSystemId: null,
			workSystem: t('표준근로제'),
			areaId: null,
			areas: [],
			areaIds: [],
			outerWork: true, // 외부 출퇴근
			restAuto: false, // 휴식 수동
			workDay: [1, 2, 3, 4, 5],
			workTime: [['09:00', '18:00']], // 근무시간
			// 여기부터는 추후 구현 기능
			restTime: [[['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']]], // 휴식지정
			coreTime: [['', '']], // 코어 타임
			requestWorkTime: ['09:00', '18:00'], // 신청 사용 범위
			paidRestDay: [7], // 유급휴일 지정
			duplicateWork: true, // 출퇴근중복여부,

			beforeWork: '', // 출근전 근무 허용 '00:00'
			autoClockOut: '', // 자동 퇴근 '00:00'
			tardyTime: '', // 지각 허용 범위
			gotoWork: ['', ''], // 출근전알림
			getOffWork: ['', ''], //퇴근후알림
			workTimeOver: ['', ''], //근무시간 초과 알림

			// 추가옵션
			// 근무기록 노출 방식
			workLogFormat: false,
			// 연장근무 승인건
			isSuccessWorkOver: false,
			// 간주근로 - 신청시? 무조건?
			isRecognizedWork: false,
			// 휴일근로 가능 여부
			isHolidayWork: false,
			// 휴일연장 가능 여부
			isHolidayWorkOver: false,
		},
		validate,
		onSubmit: async (values) => {

			const areaIds = values.areaIds;
			values.areaIds = [...areaIds]?.map((v) => v.value);
			await CompanyService.saveGroup(values)
				.then((response) => {

					if (response?.data) {
						flexChecks.resetForm();
						setIsOpenAddGroup(false);
						showNotification(t('근무 그룹'), t('근무 그룹이 {{type}}되었습니다', { type: flexChecks.values.id ? t('workDeadline.updated') : t('workDeadline.created') }), 'info');
						getGroups();
					}
				})
				.catch((e) => {
					flexChecks.setFieldValue('areaIds', areaIds);
				});
		},
	});

	const groupForm = useFormik({
		enableReinitialize: true,
			initialValues: {
				location: {
					latitude: 0,
					longitude: 0,
				},
				radius: 100,
				overseas: false,
			},
			validate,
			onSubmit: async (values) => {
				
			},
		});

	const filter = useCallback(async () => {

		switch (viewType) {
			case 'live':
				setFilterGroups([...groups].filter((v) => v.endAt === null || moment(v.endAt) > moment()));
				break;
			case 'end':
				setFilterGroups([...groups].filter((v) => v.endAt && moment(v.endAt) < moment()));
				break;
			case '':
				setFilterGroups([...groups]);
				break;
		}
		// forceUpdate();
		if (listRef.current) {
			listRef.current.recomputeCellPositions();
			// listRef.current.clearCellPositions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewType, groups, listRef]);

	const getGroups = useCallback(async () => {

		const response = await GroupService.search({ companyId: company.get.id, isUser: true });
		if (response?.data) {
			const tmp = response.data.sort(function (a, b) {
				return a.id - b.id;
			});
			setGroups(tmp);
			setViewType('live');
			//setFilterGroups(tmp);
		}
	}, [company.get.id]);

	//2022-05-13 근무그룹 운영 종료
	const workingGroupEnd = useCallback(async (groupId) => {
		await GroupService.workingGroupEnd({ groupId }).then((response) => {
			showNotification(t('근무 그룹'), t('근무 그룹 운영이 종료 되었습니다'), 'info');
			getGroups();
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		setSelectedUsers(allUsers.filter((userData) => selectedUserIds.indexOf(userData.user.id) >= 0));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUserIds]);



	useEffect(() => {

		const start = async () => {
			const getUsers = async () => {
				await CompanyService.userList(company.get.id).then((response) => {
					const users = response?.data?.rows?.filter((user) => user.state === 'SUCCESS') || [];
					setAllUsers(users);
					//setSelectedUserIds(group.users);
				});
			};
			const getWorkSystem = async () => {

				await CompanyService.getWorksystem(company.get.id).then((response) => {
					if (response?.data) {
						setWorkSystems(response.data);
						setWorkSystemSelect(
							response.data?.map((v) => {
								return {
									value: v.id,
									text: `${v.subName === '' ? '기본' : v.subName} (${v.name})`,
									label: `${v.subName === '' ? '기본' : v.subName} (${v.name})`,
								};
							})
						);

						flexChecks.setFieldValue('workSystemId', response.data[0].id);
					}
				});
			};
			const getArea = async () => {
				await CompanyService.getWorkingArea(company.get.id).then((response) => {
					const tmp = response?.data.filter((data) => data.address != 'outer');
					let areas = [{ label: '', name: `area-0`, value: 0, row: {} }];
					for (let a in tmp) {
						areas.push({
							label: tmp[a].name,
							name: `area-${tmp[a].id}`,
							value: tmp[a].id,
							row: tmp[a],
						});
					}
					setSettingArea(areas);
				});
			};
			const loadDepartment = async () => {
				//await loadAllUsers();
				const response = await DepartmentService.getDepartmentTreeUser(company.get.id);

				if (response?.data) {
					setTreeUser(toggleExpandedForAll({ treeData: response?.data?.data, expanded: true }));
					setDepartmentTree(toggleExpandedForAll({ treeData: response?.data.data, expanded: true }));
					//toggleExpandedForAll(departmentTree, true)

				}
			};

			Promise.all([loadDepartment(), getArea(), getWorkSystem(), getUsers(), getGroups()]);
		};

		start();
		return () => { };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/**
	 * 참여인원 추가하기
	 */


	useEffect(() => {
		setSelectedUsers(allUsers.filter((userData) => selectedUserIds.indexOf(userData.user.id) >= 0));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUserIds]);

	useEffect(() => {
		filter();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewType, groups]);


	useEffect(() => {

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [workSystem]);

	// 근무시간 계산
	useEffect(() => {
		// 근로정보 + 기본 근무정보 확인 계산

		if (flexChecks.values.workSystemId && flexChecks.values.workDay.length > 0) {
			// 주 00시간 월 00시간

			//const workSystem = workSystems.find((v) => parseInt(v.id) === parseInt(flexChecks.values.workSystemId));

			switch (
			workSystem?.workUnit // 기본 근무 시간
			) {
				case 'd':
					setCheckWorkTimeText({ week: 0, month: 0 });
					// 일 =
					// 주 =
					// 월 =
					break;
				case 'w':
					break;
				case 'm':
					break;
			}
		}

		// 일
		// 주
		// 월

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [flexChecks.values]);

	useEffect(() => {
		if (isOpenaddGroup) {
			if (flexChecks.values.areaId) {
				const loc = settingArea.find((i) => i.value == flexChecks.values.areaId);

				if (loc) {
					groupForm.setValues(renameMultipleRootKeys(loc.row,{
						gps: 'location',
						radius: 'circleSize',
					}));
				}
			}
		} else {
			flexChecks.resetForm();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenaddGroup]);

	const isWorkSystemDefaultType = useCallback((name, reg = '스케줄') => {
		// 탄력, 선택, 스케줄
		const rgx = RegExp(reg, 'i'); // 탄력|선택|

		if (rgx.test(name)) return false;
		else return true;
	}, []);

	const _onResize = ({ width }) => {
		const count = Math.floor(width / (columnWidth + 10));
		// const colWidth = width / count;
		setColumnCount(count);
		// setColumnWidth(colWidth);
		cellPositioner = new createMasonryCellPositioner({
			cellMeasurerCache: cache,
			columnCount: count,
			columnWidth: columnWidth,
			spacer: 10,
		});

		if (listRef.current) {
			listRef.current.recomputeCellPositions();
			// listRef.current.clearCellPositions();
		}
	};



	const customStyles = {
		menu: (provided, state) => ({
			...provided,
			zIndex: 3,
			borderColor: '#e7eef8',
		}),
		control: (provided, state) => ({
			...provided,
			borderColor: '#e7eef8',
		}),
	};

	const debounce = (e) => {
		const time = 1000;
		if (timer) {

			clearTimeout(timer);
		}
		if (e.target.value != '') {
			const newTimer = setTimeout(() => {
				const arr = [];
				const newGetSearchNodes = (topNode, searchText) => {

					const { children = [] } = topNode;

					if (
						Object.values(topNode).some((v) => {
							if (v) return v.toString().indexOf(searchText) > -1;
						})
					) {
						arr.push(topNode);
					} else {
						for (const child of children) {
							const foundArr = newGetSearchNodes(child, searchText);
							arr.concat(foundArr);
						}
					}
					return;
				};
				newGetSearchNodes(treeUser[0], e.target.value, arr);
				setDepartmentTree(toggleExpandedForAll({ treeData: [{ ...treeUser[0], children: arr }], expanded: true }));
			}, time);
			setTimer(newTimer);
		} else {
			setDepartmentTree([...treeUser]);
		}
	};

	const _content = () => {
		return (
			<div className='row w-100 h-100'>
				<div className='col-lg-6'>
					<Card className='w-100 h-100 ' shadow='none' borderSize={0} isScrollable>
						<CardHeader>
							<CardTitle>{t('조직도')}</CardTitle>
						</CardHeader>
						<CardBody className='w-100'>
							<div
								className='d-flex align-items-center my-3 px-3'
								style={{
									borderRadius: 5,
									backgroundColor: '#F1F1F1',
									border: 0,
								}}>
								<Icon icon='Search' size='2x' className='text-muted' />
								<Input
									ref={searchRef}
									id='ids'
									type='text'
									placeholder={t('검색')}
									style={{
										borderRadius: 5,
										backgroundColor: '#F1F1F1',
										border: 0,
										height: 40,
									}}
									onChange={(e) => {
										debounce(e);
									}}
								/>
							</div>
							<SortableTree
								style={{ minHeight: 500 }}
								treeData={departmentTree}
								onChange={setDepartmentTree}
								maxDepth={10}
								getNodeKey={({ node }) => node.id}
								canDrag={false}
								theme={FileExplorerTheme}
								generateNodeProps={(nodes) => {

									let nodeProps = {
										onClick: (e) => {
											e.preventDefault();
											getDepartUser(nodes.node.id);
										},
										title: (
											<>
												{nodes.node?.userId ? (
													<div>
														<Checks
															type={'checkbox'}
															label={
																<div>
																	<span className='fw-bold'>{nodes.node.title}</span><span className='ms-1 small'>| {nodes.node.userRank}</span>
																	{nodes?.node?.companyNumber && <span className='ms-2 small fw-light'>({nodes?.node?.companyNumber})</span>}
																</div>
															} // ${nodes?.node?.companyNumber && `(${nodes?.node?.companyNumber || ''})`}`}
															checked={selectGroup?.userList?.findIndex((v) => v.userId === nodes.node?.userId) > -1}
															onClick={(e) => {
																if (selectGroup?.userList?.findIndex((v) => v.userId === nodes.node?.userId) > -1) {
																	setSelectGroup({
																		...selectGroup,
																		userList: selectGroup?.userList?.filter((v) => v.userId !== nodes.node?.userId),
																	});
																} else {
																	setSelectGroup({
																		...selectGroup,
																		userList: [...selectGroup.userList, nodes.node],
																	});
																}
															}}
														/>
													</div>
												) : (
													<div className='d-flex flex-row align-items-center justify-content-center'>
														{nodes.node.title}
														{/* <Badge key={`tree-${nodes.node.id}`} color='dark' className={'ms-2'}>
															{nodes.node.userCount}
														</Badge> */}
													</div>
												)}
											</>
										),
									};
									return nodeProps;
								}}
							/>
						</CardBody>
					</Card>
				</div>

				<div className='col-lg-6'>
					<div className='row d-flex flex-row h-100'>

						<div className='col-lg-12'>
							<Card shadow='none' borderSize={0} className='h-100'>
								<CardHeader>
									<CardTitle>
										{t('workGroup.applicationPeople')} ({selectGroup?.userList?.length || 0})
									</CardTitle>
								</CardHeader>
								<CardBody className='d-flex flex-wrap align-items-start justify-content-start align-content-start w-100 p-1 pt-2'>
									{!!selectGroup?.userList?.length &&
										selectGroup?.userList.map((useUser, useUserIndex) => {

											//const useUser = allUsers.find(v=>v.user.id === u)

											return (
												<div key={`apply-user-${useUser.id}`} className='py-1 w-100'>
													<div className='w-100 position-relative text-truncate'>
														<Button
															color='light'
															size='sm'
															className='text-nowrap d-flex flex-column w-100'
															onClick={() => {
																let tmp = [...selectGroup.userList];
																tmp.splice(useUserIndex, 1);
																setSelectGroup({
																	...selectGroup,
																	userList: tmp,
																});
															}}>
															<span className='fs-6'>
																{useUser?.user?.name || useUser?.name || ''}
																{useUser?.rank && <span className='fw-light '>{` ${t(useUser.rank?.name || useUser?.userRank || '')}`}</span>}
																{useUser?.companyNumber && (<span className='fw-light '>{` ${useUser?.companyNumber || ''}`}</span>)}
															</span>
															{/* {useUser.user && (
															<span className='fw-light'>{` ${useUser.user.email}`}</span>
														)} */}
															{useUser?.department && <span className='fw-light'>{` ${useUser?.department?.name || ''}`}</span>}
														</Button>
														<Button
															icon='close'
															size='sm'
															className='position-absolute top-0 end-0'
															onClick={() => {
																let tmp = [...selectGroup.userList];
																tmp.splice(useUserIndex, 1);
																setSelectGroup({
																	...selectGroup,
																	userList: tmp,
																});
															}}
														/>

													</div>
												</div>
											);
										})}

									{!selectGroup.userList?.length && (
										<div className='fw-light'>
											<div>{t('적용 인원이 없습니다.')}</div>
										</div>
									)}
								</CardBody>
							</Card>
						</div>
					</div>
				</div>
			</div>
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}; //, [searchUsers, selectGroup, departmentTree]);
 
	return (
		<PageWrapper title={t(adminsMenu.workingManagement.subMenu.workingGroupManagement.text)}>
			<SubHeader>
				<SubHeaderLeft>
					<Breadcrumb list={null} tag={'nav'}>
						<BreadcrumbItem tag='nav' to={adminsMenu.workingManagement.path}>
							{t(adminsMenu.workingManagement.text)}
						</BreadcrumbItem>
						<BreadcrumbItem tag='nav' to={adminsMenu.workingManagement.subMenu.workingGroupManagement.path}>
							{t(adminsMenu.workingManagement.subMenu.workingGroupManagement.text)}
						</BreadcrumbItem>
					</Breadcrumb>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						icon='GroupAdd'
						color='info'
						onClick={() => {
							flexChecks.handleReset();
							setSelectGroup({});
							const workSystem = workSystems.find((v) => v.name === '표준근로제' && v.subName === '');

							setWorkSystem(workSystem);
							flexChecks.setFieldValue('workSystemId', workSystem?.id || workSystems[0]?.id);

							setIsOpenAddGroup(true);
						}}>
						{t('근무그룹 추가')}
					</Button>
				</SubHeaderRight>
			</SubHeader>

			<SubHeader>
				<SubHeaderLeft>
					<ButtonGroup
						style={{
							padding: 4,
							borderRadius: 8,
							marginTop: 15,
							marginBottom: 15,
							backgroundColor: '#F1F1F1',
						}}
					>
						<Button
							style={{
								padding: '5px 15px 5px 15px',
								borderRadius: 8,
								backgroundColor: viewType === '' ? 'white' : '#F1F1F1',
								color: viewType === '' ? 'black' : '#A4A6A9',
							}}
							onClick={() => {
								setViewType('');
							}}>
							{t('전체')}
						</Button>
						<Button
							style={{
								padding: '5px 15px 5px 15px',
								borderRadius: 8,
								backgroundColor: viewType === 'live' ? 'white' : '#F1F1F1',
								color: viewType === 'live' ? 'black' : '#A4A6A9',
							}}
							onClick={() => {
								setViewType('live');
							}}>
							{t('운영중')}
						</Button>
						<Button
							style={{
								padding: '5px 15px 5px 15px',
								borderRadius: 8,
								backgroundColor: viewType === 'end' ? 'white' : '#F1F1F1',
								color: viewType === 'end' ? 'black' : '#A4A6A9',
							}}
							onClick={() => {
								setViewType('end');
							}}>
							{t('운영종료')}
						</Button>
					</ButtonGroup>
				</SubHeaderLeft>
			</SubHeader>
			<SubHeader className='flex-row py-3 px-4'>
				<Alert
					className='d-inline-block mb-0 w-auto'
					style={{ backgroundColor: '#F1F1F1' }}
					color='light'
					isOutline={false}
				>
					<Icon
						icon='ErrorOutline'
						color='warning'
						size='lg'
						className='me-2'
					/>
					<span className='text-muted'>{t('기본그룹 외에 "추가된 근무그룹"에 설정되지 않은 인원 및 종료된 그룹 인원은 자동적으로 기본 그룹으로 적용 됩니다')}</span>
				</Alert>
			</SubHeader>
			<Page container='fluid' style={{ backgroundColor: '#FAFBFF' }}>

				<div className='row'>
					{filterGroups?.map((v) => {
						const isOut = v.endAt && moment(v.endAt) < moment() ? true : false;
 
						const disabledEdit = ['기본', 'Default', "Mặc định", "본사"].includes(v.name);


						return (
							<div key={`group-${v.id}`} className='col-xl-3 col-lg-6 col-md-6'>
								<Card stretch className={`${isOut ? 'bg-l10-dark' : null} ${v.name === t('기본') && 'border-2 border-info'} custom-box-shadow rounded-2`} style={{ borderWidth: '1px', borderColor: '#d9d9d9' }}>
									<CardHeader className={`${isOut ? 'bg-l10-dark' : null} rounded-2 align-items-start`}>
										<CardLabel>
											<CardTitle className={isOut ? 'text-muted' : null} style={{ fontSize: '1.7rem' }}>{v.name === t('기본') ? t('기본') : t(v.name)}</CardTitle>
											<CardSubTitle className='text-muted mt-3'>{v.area?.address}</CardSubTitle>
										</CardLabel>
										<CardActions>
											<Dropdown>
												{!isOut && !disabledEdit ? (
													<Tooltips title={t('근무그룹 적용 인원 관리')}>
														<Button
															onClick={() => {
																setSelectGroup(v);
																setIsOpenFindUser(true);
															}}
															className='btn-only-icon'
														>
															<img src={IconUserSettingsLine} alt='' width='20px' />
														</Button>
													</Tooltips>
												) : (
													<></>
												)}
												<DropdownToggle hasIcon={false}>
													<Button icon='MoreVert' color={darkModeStatus ? 'dark' : 'light'} />
												</DropdownToggle>
												<DropdownMenu isAlignmentEnd>
													<DropdownItem>
														<Button
															icon='Edit'
															onClick={() => {
																setSelectGroup(v);
																flexChecks.setValues(v);

																//settingArea
																if (v.areaIds?.length > 0) {
																	const b = v?.areaIds || [];
																	const a = [...settingArea].filter((o) => b.indexOf(o.value) > -1).filter((o) => o.value !== v.areaId);
																	flexChecks.setFieldValue('areaIds', a);
																}

																setWorkSystem(v.workSystem);
																flexChecks.setFieldValue('workSystemId', v.workSystem?.id, false);

																if (v.workSystem?.name) {
																	flexChecks.setFieldValue('workSystem', v.workSystem?.name, false);
																}
																setIsOpenAddGroup(true);
															}}>
															{t('수정')}
														</Button>
													</DropdownItem>
													{/* <DropdownItem>
					<Button icon='ContentCopy'>복사</Button>
				</DropdownItem> */}
													{/* 근무그룹 운영종료 */}
													{disabledEdit || (!v.endAt || moment(v.endAt) > moment()) && (
														<>
															<DropdownItem isDivider />
															<DropdownItem>
																<Button
																	icon='Delete'
																	onClick={() => {
																		// #275
																		if(v.userList.length) {
																			showNotification(t('운영종료'), t('workGroup.cannotMarkNotOperating'), 'danger');
																			return;
																		}

																		workingGroupEnd(v.id);
																	}}>
																	{t('운영종료')}
																</Button>
															</DropdownItem>
														</>
													)}
												</DropdownMenu>
											</Dropdown>
										</CardActions>
									</CardHeader>
									<CardBody>
										<div className='d-flex align-items-center justify-content-between mt-5 flex-wrap'>
											<Badge className={`${isOut ? 'bg-l25-light' : 'bg-f6'} text-muted fs-6 py-1`}>{t(v.workSystem?.name)}</Badge>
											<div className={`${isOut ? 'bg-f6' : null} d-flex  py-1`}>
												{[`요일월`, `화`, `수`, `목`, `금`, `토`, `요일일`].map((day, dayIndex) => (
													<Button
														key={`group-${v.id}-day-${dayIndex}`}
														// color={isOut ? 'dark' : 'danger'}
														className='py-1 px-2 me-1'
														size='sm'
														style={v.workDay.indexOf(dayIndex + 1) > -1 ?
															(isOut ? {
																borderColor: '#A4A6A9',
																background: '#D9D9D9',
																color: '#A4A6A9',
																borderRadius: '8px'
															} : {
																borderColor: '#556EE6',
																color: '#556EE6',
																background: '#E8ECFF',
																borderRadius: '8px'
															})
															:
															{
																background: '#FFFFFF',
																color: '#A4A6A9',
																borderColor: '#D9D9D9',
																borderRadius: '8px'
															}}
														// isOutline={'info'}
														isDisable={v.workDay.indexOf(dayIndex + 1) > -1 ? false : true}>
														<span>{t(day)}</span>
													</Button>
												))}
											</div>
										</div>
										<hr />
										<div className='d-flex justify-content-between align-items-end flex-wrap'>
											<div>
												<p className={`${isOut ? 'text-muted' : null} mb-0 fw-bold fs-6`}>
													<img src={IconCalander} alt='' width='16px' className={'me-2'} />
													{(v.startAt ? moment(v.startAt).format('YYYY-MM-DD') : '') + ' ~ ' + (v.endAt ? moment(v.endAt).format('YYYY-MM-DD') : t('상시'))}
												</p>
												<div className='d-flex align-items-center mt-3' style={{ height: 32 }}>
													<img src={IconGroups} alt='' width='16px' className={'me-2'} />
													<span className={`${isOut ? 'text-muted' : null} fw-bold fs-6 me-3`}><b className='fs-5 me-1'>{v.userList.length}</b>{t('명')}</span>
													<AvatarGroup>
														{v?.userList?.map((v, vi) => {


															return (
																<Avatar
																	key={v.userId}
																	color={'#e7e7e7'}
																	// textMarginRatio={0.2}
																	textSizeRatio={10}
																	maxInitials={2}
																	// style={{ borderColor: '#e7e7e7' }}
																	fgColor={'dark'}
																	// round
																	size={28}
																	className=''
																	userName={`${v?.name} ${t(v?.rank?.name)}`}
																	src={v?.user?.profile || null}
																	srcSet={v?.user?.profile || null}
																/>
															);
														})}
													</AvatarGroup>
												</div>
											</div>
											<div>
												{v.endAt && moment(v.endAt) < moment() ? (
													<p className='text-muted fw-bold mb-1'>
														<span className='rounded-circle bg-l25-dark d-inline-block me-2' style={{ width: 8, height: 8 }}></span>
														{t('운영종료')}
													</p>
												) : (
													<p className='text-info fw-bold mb-1'>
														<span className='rounded-circle bg-info d-inline-block me-2' style={{ width: 8, height: 8 }}></span>
														{t('운영중')}
													</p>
												)}
											</div>
										</div>
									</CardBody>
								</Card>
							</div>
						);
					})}
				</div>

				<Modal
					setIsOpen={setIsOpenFindUser}
					isOpen={isOpenFindUser}
					isStaticBackdrop={false}
					isScrollable={true}
					isCentered={true}
					size={'lg'}
				//fullScreen={true}
				>
					<ModalHeader setIsOpen={setIsOpenFindUser} className='border'>
						{/* <ModalTitle>{`[${t(selectGroup.name) || ''}] ${t('그룹 직원 관리')}`}</ModalTitle> */}
						<ModalTitle>{`${t('workGroup.grm', { name: `[${t(selectGroup.name) || ''}]` })}`}</ModalTitle>
					</ModalHeader>
					<ModalBody>{_content()}</ModalBody>
					<ModalFooter>
						<ButtonGroup>
							<Button
								type='button'
								color='info'
								className='px-5'
								onClick={async () => {
									await GroupService.saveUser(selectGroup).then((res) => {
										if (res.data) {
											showNotification(t('근무 그룹 직원 관리'), t('근무 그룹 설정이 수정되었습니다'), 'info');
											getGroups();
											setIsOpenFindUser(false);
										}
									});
								}}>
								{t('대문자적용')}
							</Button>
							{/* 							<Button
								type='button'
								color='light'
								onClick={() => {
									setIsOpenFindUser(false);
								}}>
								{t('닫기')}
							</Button> */}
						</ButtonGroup>
					</ModalFooter>
				</Modal>

				<Modal
					setIsOpen={setIsOpenAddGroup}
					isOpen={isOpenaddGroup}
					isStaticBackdrop={true}
					isScrollable={true}
					isCentered={true}
					//fullScreen={true}
					fullScreen={'lg'}
					size={'xl'}>
					<ModalHeader setIsOpen={setIsOpenAddGroup} className='border-bottom'>
						<ModalTitle>
							{/* <Icon icon='RecentActors' size='2x' color='info' /> */}
							{t(`workGroup.${selectGroup.id ? 'workGroupManagement' : 'addWorkGroup'}`)}
						</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<form className='' onSubmit={flexChecks.handleSubmit}>
							<div className='row'>
								<div className='col-sm-6'>
									<div className='mb-5'>
										<FormGroup label={<span className='fw-bold text-dark'>{t('기본 정보')}</span>}>
											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>{t('근무그룹 이름')}</Label>
												<div className='col-sm-8'>
													<Input
														name='name'
														readOnly={selectGroup.id ? ['본사', '기본','default','mặc định', 'head office', 'trụ sở chính'].includes(flexChecks.values.name?.toString()?.toLowerCase()) : false}
														onChange={flexChecks.handleChange}
														onBlur={flexChecks.handleBlur}
														value={flexChecks.values.name}
													/>
												</div>
											</div>
											{flexChecks.touched.name && flexChecks.errors.name ? (
												<div className='d-flex justify-content-end mb-1'>
													<span className='text-white p-1 rounded bg-danger small'>
														<Icon icon='info' />
														{t(flexChecks.errors.name)}
													</span>
												</div>
											) : null}

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>
													{t('근로제 선택')}
													<br />
													<Link to='/workSystem/setting'>{t('workGroup.goWorkSetting')}</Link>
													{/* <Popovers trigger={'click'} desc={<Link to='/workSystem/setting'>{t('근로제 설정 바로가기')}</Link>}>
														<Icon icon='Info' />
													</Popovers> */}
												</Label>
												<FormGroup className='col-sm-8' id='workSystem'>
													<InputGroup>
														<Select
															list={workSystemsSelect}
															id={'workSystem'}
															disabled={flexChecks.values.name === '기본'}
															key={workSystem?.id}
															value={workSystem?.id}
															onBlur={flexChecks.handleBlur}
															isTouched={flexChecks.touched.workSystemId}
															onChange={(e) => {
																const workSystem = workSystems.find((v) => parseInt(v.id) === parseInt(e.target.value));
																setWorkSystem(workSystem);
																flexChecks.setFieldValue('workSystem', workSystem?.name, false);
																flexChecks.setFieldValue('workSystemId', workSystem?.id, false);
																let tmp = [];
																// TODO: 초기화값 설정 할것
																switch (workSystem?.name) {
																	case '표준근로제':
																		tmp = [...flexChecks.values.workTime];
																		if (flexChecks.values.workTime.length >= 1) {
																			tmp.splice(1);
																		} else {
																			tmp.push(['', '']);
																		}
																		flexChecks.setFieldValue('workTime', tmp, false);
																		break;
																	case '유연근무제': // before 시차출퇴근제
																		tmp = [...flexChecks.values.workTime];
																		if (flexChecks.values.workTime.length < 2) {
																			for (let a = flexChecks.values.workTime.length; a < 2; a++) tmp.push(['', '']);
																		}
																		flexChecks.setFieldValue('workTime', tmp, false);
																		break;
																	case '자율근무제':
																		tmp = [];
																		flexChecks.setFieldValue('workTime', [['', '']], false);
																		break;

																	// 근무일, 유급휴일, 코어
																	// case '선택근무제':
																	// 	flexChecks.setFieldValue('workTime', [['', '']], false);
																	// 	break;
																	// case '탄력근무제':
																	// 	flexChecks.setFieldValue('workTime', [['', '']], false);
																	// 	break;

																	// no Option
																	case '스케줄근로제':
																		flexChecks.setFieldValue('workTime', [['', '']], false);
																		break;
																	default:
																		break;
																}
															}}
														/>
														{/* <Popovers trigger='hover' desc={<WorkSystemInfo item={workSystem} />} className='w-fit'>
															<Button type='button' icon='info' color='light' />
														</Popovers> */}
													</InputGroup>
												</FormGroup>
											</div>
											{flexChecks.touched.workSystemId && flexChecks.errors.workSystemId ? <div className='text-danger'>{t(flexChecks.errors.workSystemId)}</div> : null}

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>{t('운영기간')}</Label>
												<div className='col-sm-8'>
													<InputGroup>
														<Input
															name='startAt'
															type='date'
															disabled={flexChecks.values.name === '기본'}
															onChange={(e) => {
																flexChecks.setFieldValue('startAt', moment(e.target.value), true);
															}}
															//onBlur={flexChecks.handleBlur}
															value={moment(flexChecks.values.startAt).format('YYYY-MM-DD')}
														/>
														<Input
															name='endAt'
															type='date'
															disabled={flexChecks.values.name === '기본'}
															onChange={(e) => {
																flexChecks.setFieldValue('endAt', moment(e.target.value), true);
															}}
															//onBlur={flexChecks.handleBlur}
															value={flexChecks.values.endAt !== null ? moment(flexChecks.values.endAt).format('YYYY-MM-DD') : ''}
														/>

														<Button
															type='button'
															size='sm'
															disabled={flexChecks.values.name === '기본'}
															color={flexChecks.values.endAt !== null ? 'light' : 'info'}
															onClick={() => {
																flexChecks.setFieldValue('endAt', null, false);
															}}>
															{t('상시운영')} {flexChecks.values.endAt === null ? ' ON' : ' OFF'}
														</Button>
													</InputGroup>
														{flexChecks.touched.startAt && flexChecks.errors.startAt ? (
															<div className='d-flex justify-content-end mb-1'>
																<span className='text-white p-1 rounded bg-danger small'>
																	<Icon icon='info' />
																	{t(flexChecks.errors.startAt)}
																</span>
															</div>
														) : null}
														{flexChecks.touched.endAt && flexChecks.errors.endAt ? (
															<div className='d-flex justify-content-end mb-1'>
																<span className='text-white p-1 rounded bg-danger small'>
																	<Icon icon='info' />
																	{t(flexChecks.errors.endAt)}
																</span>
															</div>
														) : null}
												</div>
											</div>
										</FormGroup>
									</div>

									{/* 제어 시작 */}
									<div className='mb-5'>
										<FormGroup className={`mb-4`} label={<span className='fw-bold text-dark'>{t('근무 시간 설정')}</span>}>
											{/* 	{isWorkSystemDefaultType(flexChecks.values.workSystem) && (
												<> */}

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>{t('근무일 지정')}</Label>
												<div className='col-sm-8'>
													<ButtonGroup>
														{['요일월', '화', '수', '목', '금', '토', '요일일'].map((day, dayIndex) => {
															return (
																<Button
																	key={`workday-${dayIndex}`}
																	type='button'
																	color={flexChecks.values.workDay.indexOf(dayIndex + 1) > -1 ? 'success' : 'light'}
																	onClick={(e) => {
																		e.preventDefault();
																		const searchIndex = flexChecks.values.workDay.indexOf(dayIndex + 1);
																		let tmp = [...flexChecks.values.workDay];
																		if (searchIndex > -1) {
																			tmp.splice(searchIndex, 1);
																			let restTime = flexChecks.values.restTime;
																			restTime[dayIndex] = [['', '']];
																			flexChecks.setFieldValue('restTime', restTime, false);
																		} else {
																			tmp.push(dayIndex + 1);
																		}
																		flexChecks.setFieldValue('workDay', tmp, false);

																		flexChecks.setFieldValue(
																			'paidRestDay',
																			flexChecks.values.paidRestDay.filter((v) => parseInt(v) !== dayIndex + 1),
																			false
																		);
																	}}>
																	{t(day)}
																</Button>
															);
														})}
													</ButtonGroup>
												</div>
											</div>

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>
													{t('유급휴일지정')}{' '}
													<Popovers trigger={'hover'} desc={t('workGroup.mustProvideWorkers')}>
														<Icon icon='Info' />
													</Popovers>
												</Label>
												<div className='col-sm-8'>
													<ButtonGroup>
														{['요일월', '화', '수', '목', '금', '토', '요일일'].map((day, dayIndex) => {
															return (
																<Button
																	key={`paidRestDay-${dayIndex}`}
																	type='button'
																	isDisable={flexChecks.values.workDay.indexOf(dayIndex + 1) > -1 ? true : false}
																	color={flexChecks.values.paidRestDay.indexOf(dayIndex + 1) > -1 ? 'danger' : 'light'}
																	onClick={(e) => {
																		e.preventDefault();

																		const searchIndex = flexChecks.values.paidRestDay.indexOf(dayIndex + 1);
																		let tmp = [...flexChecks.values.paidRestDay];
																		if (searchIndex > -1) {
																			tmp.splice(searchIndex, 1);
																		} else {
																			tmp.push(dayIndex + 1);
																		}
																		flexChecks.setFieldValue('paidRestDay', tmp, false);

																		flexChecks.setFieldValue(
																			'workDay',
																			flexChecks.values.workDay.filter((v) => parseInt(v) !== dayIndex + 1),
																			false
																		);
																	}}>
																	{t(day)}
																</Button>
															);
														})}
													</ButtonGroup>
												</div>
											</div>

											{isWorkSystemDefaultType(flexChecks.values.workSystem) && isWorkSystemDefaultType(flexChecks.values.workSystem, '선택|탄력|유연') && (
												<>
													<div className='row mb-2'>
														<Label className='form-label col-form-label col-sm-4 ps-4'>{t('근무 가능시간')}</Label>
														<div className='col-sm-8'>
															<InputGroup className='pb-1' size='sm' id='requestWorkTime'>
																<Input
																	type='time'
																	id='requestWorkTime'
																	onChange={(e) => {
																		let tmp = [...flexChecks.values.requestWorkTime];
																		tmp[0] = e.target.value;
																		tmp[1] = moment(e.target.value, 'HH:mm').add(16, 'hour').format('HH:mm');
																		flexChecks.setFieldValue('requestWorkTime', tmp, false);
																	}}
																	value={flexChecks.values.requestWorkTime[0]}
																	onBlur={flexChecks.handleBlur}
																/>
																<Input
																	type='time'
																	id='requestWorkTime'
																	onChange={(e) => {
																		let tmp = [...flexChecks.values.requestWorkTime];
																		tmp[1] = e.target.value;
																		flexChecks.setFieldValue('requestWorkTime', tmp, false);
																	}}
																	value={flexChecks.values.requestWorkTime[1]}
																	onBlur={flexChecks.handleBlur}
																/>
																{flexChecks.values.requestWorkTime.length > 0 &&
																	moment(flexChecks.values.requestWorkTime[0]) !== '' && moment(flexChecks.values.requestWorkTime[1]) !== '' &&
																	moment(flexChecks.values.requestWorkTime[0], 'HH:mm') >= moment(flexChecks.values.requestWorkTime[1], 'HH:mm') ? (
																	<InputGroupText>{t('adminMode.popup.plusOneDay')}</InputGroupText>
																) : (
																	<></>
																)}
															</InputGroup>
														</div>
													</div>
													{flexChecks.touched.requestWorkTime && flexChecks.errors.requestWorkTime ? (
														<div className='d-flex justify-content-end mb-1'>
															<span className='text-white p-1 rounded bg-danger small'>
																<Icon icon='info' /> {t(flexChecks.errors.requestWorkTime)}
															</span>
														</div>
													) : null}
												</>
											)}
											{/* 						</>
											)} */}

											{flexChecks.touched.coreTime && flexChecks.errors.coreTime ? (
												<div className='d-flex justify-content-end mb-1'>
													<span className='text-white p-1 rounded bg-danger small'>
														<Icon icon='info' /> {t(flexChecks.errors.coreTime)}
													</span>
												</div>
											) : null}

											{isWorkSystemDefaultType(flexChecks.values.workSystem) && ( // || isWorkSystemDefaultType(flexChecks.values.workSystem, '선택|탄력')
												<>
													<div className='row mb-2'>
														<Label className='form-label col-form-label col-sm-4 ps-4'>
															<Popovers trigger='hover' desc={t('workGroup.mandatoryWorkingHours')}>
																{t('workGroup.coreHours')}
															</Popovers>
														</Label>
														<div className='col-sm-8'>
															{flexChecks.values.coreTime?.map((wt, wtIndex) => {
																return (
																	<div key={`coreTime-${wtIndex}`}>
																		<InputGroup className='pb-1' size='sm' id='coreTime'>
																			<Input
																				id='coreTime'
																				type='time'
																				onChange={(e) => {
																					let tmp = [...flexChecks.values.coreTime];
																					tmp[wtIndex][0] = e.target.value;
																					tmp[wtIndex][1] = moment(e.target.value, 'HH:mm').add(4, 'hour').format('HH:mm');
																					flexChecks.setFieldValue('coreTime', tmp, false);
																				}}
																				value={flexChecks.values.coreTime[wtIndex][0]}
																				onBlur={flexChecks.handleBlur}
																			/>
																			<Input
																				id='coreTime'
																				type='time'
																				onChange={(e) => {
																					let tmp = [...flexChecks.values.coreTime];
																					tmp[wtIndex][1] = e.target.value;
																					flexChecks.setFieldValue('coreTime', tmp, false);
																				}}
																				value={flexChecks.values.coreTime[wtIndex][1]}
																				onBlur={flexChecks.handleBlur}
																			/>
																			{flexChecks.values.coreTime.length > 0 &&
																				flexChecks.values.workSystem !== '자율근무제' &&
																				flexChecks.values.coreTime?.[wtIndex]?.[0] !== '' && !flexChecks.values.coreTime?.[wtIndex]?.[1] !== '' &&
																				moment(flexChecks.values.coreTime[wtIndex][1], 'HH:mm') <= moment(flexChecks.values.coreTime[wtIndex][0], 'HH:mm') ? (
																				<InputGroupText>{t('adminMode.popup.plusOneDay')}</InputGroupText>
																			) : (
																				<></>
																			)}
																			{wtIndex > 0 ? (
																				<Button
																					type='button'
																					color='light'
																					onClick={() => {
																						let tmp = [...flexChecks.values.coreTime];
																						tmp.splice(wtIndex, 1);
																						flexChecks.setFieldValue('coreTime', tmp);
																					}}>
																					{t('제거')}
																				</Button>
																			) : (
																				<></>
																			)}
																			{wtIndex === flexChecks.values.coreTime.length - 1 ? (
																				<Button
																					type='button'
																					color='light'
																					onClick={() => {
																						flexChecks.setFieldValue('coreTime', [...flexChecks.values.coreTime, ['', '']], false);
																					}}>
																					{t('추가')}
																				</Button>
																			) : (
																				<></>
																			)}
																		</InputGroup>
																	</div>
																);
															})}
														</div>
													</div>

													{isWorkSystemDefaultType(flexChecks.values.workSystem, '선택|탄력|유연') && (
														<div className='row mb-2'>
															<Label className='form-label col-form-label col-sm-4 ps-4'>{t('근무시간')}</Label>
															<div className='col-sm-8'>
																{flexChecks.values.workSystem !== t('자율근무제') ? (
																	<div>
																		{flexChecks.values.workTime?.map((wt, wtIndex) => {
																			return (
																				<div key={`worktime-${wtIndex}`}>
																					<InputGroup className='pb-1' size='sm' id='workTime'>
																						<Input
																							id='workTime'
																							type='time'
																							onChange={(e) => {
																								let tmp = [...flexChecks.values.workTime];
																								tmp[wtIndex][0] = e.target.value;
																								tmp[wtIndex][1] = moment(e.target.value, 'HH:mm').add(9, 'hour').format('HH:mm');
																								flexChecks.setFieldValue('workTime', tmp, false);
																							}}
																							value={flexChecks.values.workTime[wtIndex][0]}
																							onBlur={flexChecks.handleBlur}
																						/>
																						<Input
																							id='workTime'
																							type='time'
																							onChange={(e) => {
																								let tmp = [...flexChecks.values.workTime];
																								tmp[wtIndex][1] = e.target.value;
																								flexChecks.setFieldValue('workTime', tmp, false);
																							}}
																							value={flexChecks.values.workTime[wtIndex][1]}
																							onBlur={flexChecks.handleBlur}
																						/>
																						{flexChecks.values.workTime.length > 0 &&
																							flexChecks.values.workSystem !== '자율근무제' &&
																							flexChecks.values.workTime?.[wtIndex]?.[0] !== '' && flexChecks.values.workTime?.[wtIndex]?.[1] !== '' &&
																							moment(flexChecks.values.workTime[wtIndex][1], 'HH:mm') <= moment(flexChecks.values.workTime[wtIndex][0], 'HH:mm') ? (
																							<InputGroupText>{t('adminMode.popup.plusOneDay')}</InputGroupText>
																						) : (
																							<></>
																						)}
																						{wtIndex > 0 ? (
																							<Button
																								type='button'
																								color='light'
																								onClick={() => {
																									let tmp = [...flexChecks.values.workTime];
																									tmp.splice(wtIndex, 1);
																									flexChecks.setFieldValue('workTime', tmp);
																								}}>
																								{t('제거')}
																							</Button>
																						) : (
																							<></>
																						)}
																						{flexChecks.values.workSystem !== t('표준근로제') && wtIndex === flexChecks.values.workTime.length - 1 ? (
																							<Button
																								type='button'
																								color='light'
																								onClick={() => {
																									flexChecks.setFieldValue('workTime', [...flexChecks.values.workTime, ['', '']], false);
																								}}>
																								{t('추가')}
																							</Button>
																						) : (
																							<></>
																						)}
																					</InputGroup>
																				</div>
																			);
																		})}
																		{flexChecks.errors.workTime && flexChecks.touched.workTime ? (
																			<div className='d-flex justify-content-end mb-1'>
																				<span className='text-white p-1 rounded bg-danger small'>
																					<Icon icon='info' />
																					{t(flexChecks.errors.workTime)}
																				</span>
																			</div>
																		) : null}
																	</div>
																) : (
																	<div className='align-middle py-2'>자율근무</div>
																)}
															</div>
														</div>
													)}

													<div className='row mb-2'>
														<Label className='form-label col-form-label col-sm-4 ps-4'>
															{t('휴게시간지정')}{' '}
															<Popovers trigger={'hover'} desc={t('adminMode.popup.manualBreakTimeRecording')}>
																<Icon icon='Info' />
															</Popovers>
														</Label>
														<div className='col-sm-8'>
															<InputGroup>
																<ButtonGroup>
																	<Button
																		type='button'
																		// isOutline={!flexChecks.values.restAuto}
																		// color={flexChecks.values.restAuto ? 'success' : 'light'}>
																		id={'restAuto'}
																		color={flexChecks.values.restAuto ? 'info' : 'light'}
																		isLight={flexChecks.values.restAuto}
																		onBlur={flexChecks.handleBlur}
																		onClick={() => {
																			flexChecks.setFieldValue('restAuto', true); //, false);
																			flexChecks.setFieldValue('restTime', [[['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']]], false);
																		}}>
																		{t('수동 휴게시간')}
																	</Button>
																	<Button
																		type='button'
																		id={'restAuto'}
																		// isOutline={flexChecks.values.restAuto}
																		color={!flexChecks.values.restAuto ? 'info' : 'light'}
																		isLight={!flexChecks.values.restAuto}
																		onBlur={flexChecks.handleBlur}
																		onClick={() => {
																			flexChecks.setFieldValue('restAuto', false); //, false);
																		}}
																	// color={!flexChecks.values.restAuto ? 'success' : 'light'}
																	>
																		{t('자동 휴게시간')}
																	</Button>
																</ButtonGroup>
															</InputGroup>

															{!flexChecks.values.restAuto && (
																<div className='pt-3'>
																	<ChecksGroup>
																		<Checks
																			// name='checkWorkTime'
																			type='checkbox'
																			checked={flexChecks.values.restTime[0][0][0] === '' ? true : false}
																			onChange={() => {
																				flexChecks.setFieldValue('restTime', [[['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']]], false);
																			}}
																			label={
																				<div className='d-flex flex-row align-middle'>
																					<div className='fw-bold'>{t('근무시간 기준')}</div>
																					<Popovers trigger='hover' desc={<div>{t('근로자가 4시간 이상 근무시 30분 휴게시간을 부여합니다')}</div>}>
																						<Icon icon='InfoOutline' className='ms-1' />
																					</Popovers>
																				</div>
																			}
																		/>
																		<Checks
																			// name='checkOurTime'
																			type='checkbox'
																			checked={flexChecks.values.restTime[0][0][0] !== '' ? true : false}
																			onChange={() => {
																				flexChecks.setFieldValue('restTime', [[['12:00', '13:00']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']], [['', '']]], true);
																			}}
																			label={
																				<div className='d-flex flex-row align-middle'>
																					<div className='fw-bold'>{t('특정시간 기준')}</div>
																					<Popovers trigger='hover' desc={<div>{t('휴게시간을 직접 지정합니다')}</div>}>
																						<Icon icon='InfoOutline' className='ms-1' />
																					</Popovers>
																				</div>
																			}
																		/>
																	</ChecksGroup>
																</div>
															)}
															{flexChecks.values.restAuto && <div className='p-3'>{t('앱의 휴식기능을 이용하여 수동으로 관리할수 있습니다')}</div>}
														</div>
													</div>

													{flexChecks.values.restTime[0][0][0] !== '' &&
														['월', '화', '수', '목', '금', '토', '일'].map((day, wtIndex) => {
															return (
																<div key={`resttime-${wtIndex}`} className={`mt-2 ms-5 ps-5 ${flexChecks.values.workDay.indexOf(wtIndex + 1) === -1 && 'd-none'}`}>
																	{flexChecks.values.restTime[wtIndex].map((_, i) => {
																		return (
																			<>
																				<div key={`resttime-${wtIndex}-${i}`} className='d-flex flex-row align-middle'>
																					<div style={{ width: 100 }} className='text-center'>
																						<ButtonGroup size='sm'>
																							{flexChecks.values.workDay.indexOf(wtIndex + 1) > -1 &&
																								i === 0 &&
																								flexChecks.values.restTime[wtIndex][i][0] !== '' &&
																								flexChecks.values.restTime[wtIndex][i][1] !== '' ? (
																								<Button
																									type='button'
																									color='success'
																									isLight
																									className='text-nowrap'
																									onClick={() => {
																										let tmp = [...flexChecks.values.restTime];
																										flexChecks.values.workDay?.map((v) => {
																											tmp[v - 1] = [...flexChecks.values.restTime[wtIndex]];
																										});
																										flexChecks.setFieldValue('restTime', tmp);
																									}}>
																									{t('일괄적용')}
																								</Button>
																							) : (
																								<></>
																							)}
																						</ButtonGroup>
																					</div>
																					<InputGroup size='sm' id='restTime'>
																						<InputGroupText>
																							{i === 0 ? (
																								<span className={flexChecks.values.workDay.indexOf(wtIndex + 1) > -1 && i === 0 ? 'text-success' : 'text-dark'}>{t(day)}</span>
																							) : (
																								<Icon icon='SubdirectoryArrowRight' size='sm' />
																							)}
																						</InputGroupText>
																						<Input
																							id='restTime'
																							type='time'
																							disabled={flexChecks.values.workDay.indexOf(wtIndex + 1) > -1 ? false : true}
																							onChange={(e) => {
																								let tmp = [...flexChecks.values.restTime];
																								tmp[wtIndex][i][0] = e.target.value;
																								tmp[wtIndex][i][1] = moment(e.target.value, 'HH:mm').add(1, 'hour').format('HH:mm');
																								flexChecks.setFieldValue('restTime', tmp, false);
																							}}
																							value={flexChecks.values.restTime[wtIndex][i][0]}
																							onBlur={flexChecks.handleBlur}
																						/>
																						<Input
																							id='restTime'
																							type='time'
																							disabled={flexChecks.values.workDay.indexOf(wtIndex + 1) > -1 ? false : true}
																							onChange={(e) => {
																								let tmp = [...flexChecks.values.restTime];
																								tmp[wtIndex][i][1] = e.target.value;
																								flexChecks.setFieldValue('restTime', tmp, false);
																							}}
																							value={flexChecks.values.restTime[wtIndex][i][1]}
																							onBlur={flexChecks.handleBlur}
																						/>
																					</InputGroup>
																					<div style={{ width: 100 }} className='text-start ms-1'>
																						<ButtonGroup size='sm'>
																							{flexChecks.values.workDay.indexOf(wtIndex + 1) > -1 && flexChecks.values.restTime[wtIndex].length === i + 1 ? (
																								/* &&
																					flexChecks.values.restTime[wtIndex][i][0] !== '' &&
																					flexChecks.values.restTime[wtIndex][i][1] !== '' */
																								<>
																									<Button
																										type='button'
																										color='light'
																										className='text-nowrap'
																										onClick={() => {
																											let tmp = [...flexChecks.values.restTime];
																											tmp[wtIndex].push(['', '']);
																											flexChecks.setFieldValue('restTime', tmp, false);
																										}}>
																										{t('+')}
																									</Button>
																									{i > 0 && (
																										<Button
																											type='button'
																											color='light'
																											className='text-nowrap'
																											onClick={() => {
																												let tmp = [...flexChecks.values.restTime];
																												tmp[wtIndex].splice(i, 1);
																												flexChecks.setFieldValue('restTime', tmp, false);
																											}}>
																											{t('-')}
																										</Button>
																									)}
																								</>
																							) : (
																								<></>
																							)}
																						</ButtonGroup>
																					</div>
																				</div>
																				{flexChecks.values.restTime[wtIndex][i][0] !== '' &&
																					flexChecks.values.restTime[wtIndex][i][1] !== '' &&
																					flexChecks.errors.restTime &&
																					(flexChecks.touched.restTime || flexChecks.touched.workSystemId || flexChecks.touched.workTime || flexChecks.touched.requestWorkTime) &&
																					isErrorValid.map((r, ri) =>
																						(i <= 0 && isErrorValid[ri][1] === i && wtIndex === isErrorValid[ri][0] && _ === flexChecks.values.restTime[isErrorValid[ri][0]][isErrorValid[ri][1]]) ||
																							(i >= 0 && isErrorValid[ri][1] === i && wtIndex === isErrorValid[ri][0] && _ === flexChecks.values.restTime[isErrorValid[ri][0]][isErrorValid[ri][1]]) ? (
																							<div key={`workgroupError${ri}`} className='d-flex justify-content-end mb-1'>
																								<span className='text-white p-1 rounded bg-danger small'>
																									<Icon icon='info' />
																									{t(flexChecks.errors.restTime)}
																								</span>
																							</div>
																						) : null
																					)}
																			</>
																		);
																	})}
																</div>
															);
														})}

													{!flexChecks.values.restAuto && flexChecks.values.restTime[0][0][0] !== '' && (
														<>
															{flexChecks.values.workDay.map((v) =>
																flexChecks.values.restTime[parseInt(v) - 1].map((vv, i) =>
																	(flexChecks.values.restTime[parseInt(v) - 1][i][0] === '' && flexChecks.values.restTime[parseInt(v) - 1][i][1] !== '') ||
																		(flexChecks.values.restTime[parseInt(v) - 1][i][0] !== '' && flexChecks.values.restTime[parseInt(v) - 1][i][1] === '') ? (
																		<span key={`error-${v}-${i}`}><div className='d-flex justify-content-end mb-1'>
																			<span className='text-white p-1 rounded bg-danger small'>
																				<Icon icon='info' />
																				{t('휴식시간을 지정해주세요')}
																			</span>
																		</div></span>
																	) : null
																)
															)}
														</>
													)}
												</>
											)}
										</FormGroup>
									</div>

									<div className='mb-5'>
										<FormGroup className={`mb-4`} label={<span className='fw-bold text-dark'>{t('workGroup.settingOutsideOfWork')}</span>}>
											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4 align-self-center'>
													{t('근무기록 노출 방식')}
												</Label>
												<div className='col-sm-8 align-self-center'>
													<ChecksGroup>
														<ChecksNew
															id='workLogFormat'
															name='workLogFormat'
															type='checkbox'
															checked={flexChecks.values.workLogFormat}
															onChange={flexChecks.handleChange}
															labels={[
																<div className='d-flex flex-row align-middle' key={'workLogFormat-false'}>
																	<div className='fw-bold'>{t('실제 근무시간')}</div>
																</div>,
																<div className='d-flex flex-row align-middle' key={'workLogFormat-true'}>
																	<div className='fw-bold'>{t('근무 계획시간')}</div>
																</div>,
															]}
														/>
													</ChecksGroup>

													{flexChecks.values.workLogFormat && (
														<>
															<ChecksGroup>
																<ChecksNew
																	id='workLogFormat'
																	name='workLogFormat'
																	type='checkbox'
																	checked={flexChecks.values.workLogFormat}
																	onChange={flexChecks.handleChange}
																	labels={[
																		<div className='d-flex flex-row align-middle' key={'workLogFormat-false'}>
																			<div className='fw-bold'>{t('실제 근무시간')}</div>
																		</div>,
																		<div className='d-flex flex-row align-middle' key={'workLogFormat-true'}>
																			<div className='fw-bold'>{t('근무 계획시간')}</div>
																		</div>,
																	]}
																/>
															</ChecksGroup>
														</>
													)}
												</div>
											</div>

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4 align-self-center'>
													{t('workGroup.whetherToApplyForOvertimeWork')}
													<Popovers
														trigger='hover'
														desc={<div>{t('workGroup.workGroupPopup')}</div>}>
														<Icon icon='InfoOutline' className='ms-1' />
													</Popovers>
												</Label>
												<div className='col-sm-8 align-self-center'>
													<ChecksGroup>
														<ChecksNew
															id='isSuccessWorkOver'
															name='isSuccessWorkOver'
															type='checkbox'
															checked={flexChecks.values.isSuccessWorkOver}
															onChange={flexChecks.handleChange}
															labels={[
																<div className='d-flex flex-row align-middle' key={'isSuccessWorkOver-false'}>
																	<div className='fw-bold'>{t('workGroup.actualOvertimeWork')}</div>
																</div>,
																<div className='d-flex flex-row align-middle' key={'isSuccessWorkOver-true'}>
																	<div className='fw-bold'>{t('workGroup.approvedOvertimeWork')}</div>
																</div>,
															]}
														/>
													</ChecksGroup>
												</div>
											</div>

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4 align-self-center'>
													{t('workGroup.whetherWorkOnHolidaysIsPossible')}
													<Popovers trigger='hover' desc={<div>{t('workGroup.workIsPossible')}</div>}>
														<Icon icon='InfoOutline' className='ms-1' />
													</Popovers>
												</Label>
												<div className='col-sm-8 align-self-center'>
													<ChecksGroup>
														<ChecksNew
															id='isHolidayWork'
															name='isHolidayWork'
															type='checkbox'
															checked={flexChecks.values.isHolidayWork}
															onChange={flexChecks.handleChange}
															labels={[
																<div className='d-flex flex-row align-middle' key='isHolidayWork-false'>
																	<div className='fw-bold'>{t('미사용')}</div>
																</div>,
																<div className='d-flex flex-row align-middle' key='isHolidayWork-true'>
																	<div className='fw-bold'>{t('사용')}</div>
																</div>,
															]}
														/>
													</ChecksGroup>
												</div>
											</div>

											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4 align-self-center'>
													{t('workGroup.whetherWorkOnHolidaysIsExtended')}
													<Popovers trigger='hover' desc={<div>{t('workGroup.workingOnHolidays')}</div>}>
														<Icon icon='InfoOutline' className='ms-1' />
													</Popovers>
												</Label>
												<div className='col-sm-8 align-self-center'>
													<ChecksGroup>
														<ChecksNew
															id='isHolidayWorkOver'
															name='isHolidayWorkOver'
															type='checkbox'
															disabled={!flexChecks.values.isHolidayWork}
															checked={flexChecks.values.isHolidayWorkOver}
															onChange={flexChecks.handleChange}
															labels={[
																<div className='d-flex flex-row align-middle' key='isHolidayWorkOver-false'>
																	<div className='fw-bold'>{t('미사용')}</div>
																</div>,
																<div className='d-flex flex-row align-middle' key='isHolidayWorkOver-true'>
																	<div className='fw-bold'>{t('사용')}</div>
																</div>,
															]}
														/>
													</ChecksGroup>
												</div>
											</div>
										</FormGroup>
									</div>

									{/* 제어 끝 */}
								</div>

								<div className='col-sm-6'>
									<div className='mb-5'>
										<FormGroup
											className={`mb-4`}
											label={
												<div className='d-flex'>
													<span className='fw-bold text-dark'>{t('workGroup.workSpaceSetting')}</span>
													<div className='small d-flex align-items-end mx-2'>
														<Link to={'/work/place'}>{t('근무지 관리 바로가기')}</Link>
													</div>
												</div>
											}>
											<div className='row mb-2'>
												<Label className='form-label col-form-label col-sm-4 ps-4'>{t('기본 출/퇴근장소')}</Label>
												<div className='col-sm-8'>
													<Select
														placeholder={t('기본 출근장소를 선택해주세요.')}
														onChange={(e) => {
															e.preventDefault();
															if (e.nativeEvent.target.value > 0) {
																const loc = settingArea.find((i) => i.value == e.nativeEvent.target.value);

																if (loc) {
																	groupForm.setValues(renameMultipleRootKeys(loc.row,{
																		gps: 'location',
																		radius: 'circleSize',
																	}))	
																	
																}

																flexChecks.setFieldValue('areaId', e.nativeEvent.target.value, false);
															}
														}}
														value={flexChecks.values.areaId}>
														<Options list={settingArea} />
													</Select>
												</div>
											</div>
											{flexChecks.touched.areaId && flexChecks.errors.areaId ? (
												<div className='d-flex justify-content-end mb-1'>
													<span className='text-white p-1 rounded bg-danger small fw-light'>
														<Icon icon='info' />
														{t(flexChecks.errors.areaId)}
													</span>
												</div>
											) : null}
										</FormGroup>

										<div className='row mb-2'>
											<Label className='form-label col-form-label col-sm-4 ps-4'>{t('추가 근무지')}</Label>
											<div className='col-sm-8'>
												<Select2
													options={[...settingArea].filter((v) => parseInt(v.value) !== parseInt(flexChecks.values.areaId))}
													placeholder={t('기본 근무지 외 근무지 추가 지정')}
													isMulti
													value={flexChecks.values.areaIds}
													onChange={(e) => {
														flexChecks.setFieldValue('areaIds', e);
													}}
													styles={customStyles}
													theme={(theme) => ({
														...theme,
														borderRadius: '1rem',
													})}
												/>
											</div>
										</div>

										<div
											className='position-relative border w-100 d-inline-block bg-l25-light border'
											style={{
												// maxHeight: window.screen.height / 3.5,
												height: '100%',
											}}>
											<div className='position-absolute top-0 end-0 bg-white p-2 rounded m-2' style={{ zIndex: 2 }}>
												<FormGroup
													label={
														<span className='fw-bold text-dark'>
															<Popovers desc={t('workDeadline.flexibleCommuteTooltip')} trigger='hover'>
																{t('근무지 외 출퇴근 허용')}
															</Popovers>
														</span>
													}>
													<ButtonGroup className='ps-3' size='sm'>
														<Button
															type='button'
															// isOutline={!flexChecks.values.outerWork}
															color={flexChecks.values.outerWork ? 'info' : 'light'}
															isLight={flexChecks.values.outerWork}
															onClick={() => {
																flexChecks.setFieldValue('outerWork', true);
															}}
														// color={flexChecks.values.outerWork ? 'info' : 'light'}
														>
															{t('허용')}
														</Button>
														<Button
															type='button'
															// isOutline={flexChecks.values.outerWork}
															color={!flexChecks.values.outerWork ? 'info' : 'light'}
															isLight={!flexChecks.values.outerWork}
															onClick={() => {
																flexChecks.setFieldValue('outerWork', false);
															}}
														// color={flexChecks.values.outerWork ? 'light' : 'info'}
														>
															{t('비허용')}
														</Button>
													</ButtonGroup>
												</FormGroup>
											</div>
											{groupForm.values.overseas ?
												<div
													id='googleMap'
													className='google-map border border-light d-flex justify-content-center align-items-center'
													style={{ width: '100%', height: '100%', minHeight: screen.height / 4 }}>
													{flexChecks.values.areaId === null ? <span className='fw-bold'>{t('workGroup.onOffWorkLocation')}</span> : <iframe
														width='100%'
														height={screen.height / 4}
														scrolling='no'
														src={`https://www.google.com/maps/embed/v1/place?key=${config.GG_KEY}&q=${groupForm.values.location.latitude},${groupForm.values.location.longitude}&zoom=16&maptype=roadmap`}></iframe>}

												</div>

												:
												 <MapComponent mapLevel={4} groupForm={groupForm} shouldClick={false} className='kakao-map border border-light d-flex justify-content-center align-items-center'
												style={{ width: '100%', height: '100%', minHeight: screen.height / 4 }}>
                                                      <></>
													</MapComponent>
												// <></>
													}


										</div>
									</div>

									<div className='row mb-5'>
										<div className='col-md-12'>
											<FormGroup className={`mb-4`} label={<span className='fw-bold text-dark'>{t('근무 고급 설정')}</span>}>
												<div className='row mb-2'>
													<Label className='form-label col-form-label col-sm-4 ps-4'>{t('출근전 근무')}</Label>
													<div className='col-sm-8'>
														<ButtonGroup>
															<Button
																type='button'
																color={flexChecks.values.beforeWork !== '' ? 'info' : 'light'}
																isLight={flexChecks.values.beforeWork !== ''}
																onClick={() => {
																	flexChecks.setFieldValue('beforeWork', '01:00');
																}}>
																{t('허용')}
															</Button>
															<Button
																type='button'
																color={flexChecks.values.beforeWork === '' ? 'info' : 'light'}
																isLight={flexChecks.values.beforeWork === ''}
																onClick={() => {
																	flexChecks.setFieldValue('beforeWork', '');
																}}>
																{t('비허용')}
															</Button>
														</ButtonGroup>
														{flexChecks.values.beforeWork !== '' && (
															<InputGroup className='mt-1'>
																{/* <InputGroupText>-</InputGroupText> */}
																<Select
																	list={Array.from(Array(24).keys()).map((v) => {
																		const time = (v + 1) * 30 * 60;
																		return { value: convertMinsToHrsMins(time), text: convertMinsToHrsMinsString((v + 1) * 30 * 60) };
																	})}
																	value={flexChecks.values.beforeWork}
																	onChange={(e) => {
																		flexChecks.setFieldValue('beforeWork', e.target.value);
																	}}
																/>
																<InputGroupText>{t('workGroup.afterFullAttendance', { time: flexChecks.values.beforeWork || 0 })}</InputGroupText>
															</InputGroup>
														)}
													</div>
												</div>
												<div className='row mb-2'>
													<Label className='form-label col-form-label col-sm-4 ps-4'>{t('자동 퇴근')}</Label>
													<div className='col-sm-8'>
														<ButtonGroup>
															<Button
																type='button'
																color={flexChecks.values.autoClockOut !== '' ? 'info' : 'light'}
																isLight={flexChecks.values.autoClockOut !== ''}
																onClick={() => {
																	flexChecks.setFieldValue('autoClockOut', '01:00');
																}}>
																{t('허용')}
															</Button>
															<Button
																type='button'
																color={flexChecks.values.autoClockOut === '' ? 'info' : 'light'}
																isLight={flexChecks.values.autoClockOut === ''}
																onClick={() => {
																	flexChecks.setFieldValue('autoClockOut', '');
																}}>
																{t('비허용')}
															</Button>
														</ButtonGroup>
														{flexChecks.values.autoClockOut !== '' && (
															<InputGroup className='mt-1'>
																{/* <InputGroupText>+</InputGroupText> */}
																<Select
																	list={Array.from(Array(24).keys()).map((v) => {
																		const time = ((v + 1) * 30 * 60);
																		return { value: convertMinsToHrsMins(time), text: convertMinsToHrsMinsString(time) };
																	})}
																	value={flexChecks.values.autoClockOut}
																	onChange={(e) => {
																		flexChecks.setFieldValue('autoClockOut', e.target.value);
																	}}
																/>
																<InputGroupText>{t('workGroup.autoLeaveProcessing', { time: flexChecks.values.autoClockOut || 0 })}</InputGroupText>
															</InputGroup>
														)}
													</div>
												</div>
												<div className='row mb-2'>
													<Label className='form-label col-form-label col-sm-4 ps-4'>{t('지각 허용 시간')}</Label>
													<div className='col-sm-8'>
														<ButtonGroup>
															<Button
																type='button'
																color={flexChecks.values.tardyTime !== '' ? 'info' : 'light'}
																isLight={flexChecks.values.tardyTime !== ''}
																onClick={() => {
																	flexChecks.setFieldValue('tardyTime', '00:05');
																}}>
																{t('허용2')}
															</Button>
															<Button
																type='button'
																color={flexChecks.values.tardyTime === '' ? 'info' : 'light'}
																isLight={flexChecks.values.tardyTime === ''}
																onClick={() => {
																	flexChecks.setFieldValue('tardyTime', '');
																}}>
																{t('비허용2')}
															</Button>
														</ButtonGroup>
														{flexChecks.values.tardyTime !== '' && (
															<InputGroup className='mt-1'>
																{/* <InputGroupText>+</InputGroupText> */}
																<Select
																	list={Array.from(Array(24).keys()).map((v) => {
																		const time = ((v + 1) * 5 * 60);
																		return { value: convertMinsToHrsMins(time), text: convertMinsToHrsMinsString(time) };
																	})}
																	value={flexChecks.values.tardyTime}
																	onChange={(e) => {
																		flexChecks.setFieldValue('tardyTime', e.target.value);
																	}}
																/>
																<InputGroupText>{t('workGroup.processedAfter', { time: flexChecks.values.tardyTime || 0 })}</InputGroupText>
															</InputGroup>
														)}
													</div>
												</div>
											</FormGroup>
										</div>
									</div>
								</div>
							</div>
						</form>
					</ModalBody>
					<ModalFooter className='border-top d-flex justify-content-between'>
						{/* <div className='lead'>
								주 <b>{checkWorkTimeText?.week}</b> 시간
								<small className='border-start px-2 py-1 ms-2'>월 <b>{checkWorkTimeText?.month}</b> 시간</small>
							</div> */}
						<div></div>

						<div>
							<ButtonGroup>
								<Button
									type='button'
									color='info'
									icon='SaveAlt'
									onClick={() => {
										flexChecks.handleSubmit();
									}}>
									{t(flexChecks.values.id ? '수정' : '저장')}
								</Button>
								<Button
									type='button'
									color='light'
									icon='Close'
									onClick={() => {
										//flexChecks.handleReset();
										// flexChecks.resetForm();
										setIsOpenAddGroup(false);
									}}>
									{t('닫기')}
								</Button>
							</ButtonGroup>
						</div>
					</ModalFooter>
				</Modal>
			</Page>
		</PageWrapper>
	);
};


export default WorkingGroup;
