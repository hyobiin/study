import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import Card, { CardHeader, CardBody, CardTitle, CardSubTitle } from '../../../../components/bootstrap/Card';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Input from '../../../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import Select from '../../../../components/bootstrap/forms/Select';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import { useMst } from '../../../../models';
import { useEffectOnce } from 'react-use';
import DepartmentService from '../../../../services/DepartmentService';
import GroupService from '../../../../services/GroupService';
import PaginationButtons, { dataPagination } from '../../../../components/PaginationButtons';
import CompanyService from '../../../../services/CompanyService';
import moment from 'moment';
import showNotification from '../../../../components/extras/showNotification';
import PaginationButtons2 from '../../../../components/PaginationButtons2';
import get from 'lodash/get';

/******************************************************************
 * 파일명 : frontend2\src\pages\AuthMenu\Company\components\RestSettingModal.js
 * 메뉴 : 관리자모드 > 환경설정 > 휴가 > 정책 설정 > 이월연차 인원 범위 > 선택 지정 (모달)
 * URL  : /vacation/setting
 * 설명 : 이월연차 기준 설정 모달
 ******************************************************************/

const RestSettingModal = (props) => {
    const { company, user } = useMst();
    const { t } = useTranslation();

    const [restGroups, setRestGroups] = useState([]);
    const [restDepartments, setRestDepartments] = useState(props?.restDepartments);
    const [userList, setUserList] = useState(props?.originData);
    const [departTableList, setDepartTableList] = useState(props?.originData);
    const [groupUsers, setGroupUsers] = useState([]);
    const [currentPageE, setCurrentPageE] = useState(1);
    const [perPageE, setPerPageE] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [annualBasic, setAnnualBasis] = useState('');
    const [error, setError] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState({});
    const [restStandard, setRestStandard] = useState('all');
    const [confirmModal, setConfirmModal] = useState(false);
    const [individButton, setSelectedIndividButton] = useState('group');
    const [searchName, setSearchName] = useState('');
    const [sendSearchUser, setSendSeachUser] = useState('');
    const [departSearchText, setDepartSearchText] = useState('');
    const [searchedDepartList, setSearchedDepartList] = useState([]);
    const [preFilter, setPreFilter] = useState([])
    const [userRefreshPage, setUserRefreshPage] = useState(0)

    const [departList, setDepartList] = useState([]);
    const [selectedDepart, setSelectedDepart] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [searchedDepartUserList, setSearchedDepartUserList] = useState([]);
    const [departUserList, setDepartUserList] = useState([]);
    const [selectedUserList, setSelectedUserList] = useState([]);

    const [restGroupsCheck, setRestGroupsCheck] = useState([]);
    const [restDepartCheck, setRestDepartCheck] = useState([]);
    const [restDepartAllCheck, setRestDepartAllCheck] = useState(false);
    const [restUserCheck, setRestUserCheck] = useState([]);
    const [restUserAllCheck, setRestUserAllCheck] = useState(false);
    const [restDate, setRestDate] = useState(['01', '01']);
    const [restOptionYear, setRestOptionYear] = useState(1);
    const [restRoundYear, setRestRoundYear] = useState('ROUND');
    const [userWorkType, setUserWorkType] = useState({
        general: false,
        functional: false,
        regular: false,
        contract: false,
    });
    const [carryOverDays, setCarryOverDays] = useState('');

    // 연차 적용 대상 (탭)
    const individTabButtons = [
        { id: 'group', label: '근무그룹별' },
        { id: 'depart', label: '부서별' },
        { id: 'user', label: '개인별' },
    ];

    const handleButtonClick = (buttonId) => {
        setSelectedIndividButton(buttonId);
        setRestGroupsCheck([]);
        setRestDepartCheck([]);
        setRestDepartAllCheck(false);
        setRestUserCheck([]);
        setRestUserAllCheck(false);
    };

    const customStyle = {
        borderRadius: 5,
        backgroundColor: '#F7F7F7',
        border: '1px solid #e6e7e7',
        maxWidth: '200px',
        flexGrow: 1,
    };

    const [employType, setEmployType] = useState('');
    const [employTypeDepart, setEmployTypeDepart] = useState('');
    const [employList, setEmployList] = useState([]);

    const restHistoryColumnData = [
        { name: 'check', key1: 'check' },
        { name: '이름', key1: 'restday', key2: 'name' },
        { name: '부서', key1: 'createdAt' },
        { name: '직위', key1: 'restday', key2: 'deduction' },
        { name: '입사일', key1: 'extraRestday' },
        { name: 'holidayWorkLog.employeeType', key1: 'employType' },
        { name: '현재 기준', key1: 'state' },
    ];

    const restHistoryColumnData2 = [
        { name: 'check', key1: 'check' },
        { name: '이름', key1: 'restday', key2: 'name' },
        { name: '부서', key1: 'createdAt' },
        { name: '직위', key1: 'restday', key2: 'deduction' },
        { name: '입사일', key1: 'extraRestday' },
        { name: 'holidayWorkLog.employeeType', key1: 'employType' },
        { name: '현재 기준', key1: 'state' },
    ];


    const onCurrentPageData = dataPagination(searchedDepartUserList, currentPage, perPage);

    // 모달 뜰 때 초기화
    useEffect(() => {
        if(props.restScopeModalOpen){
            setCarryOverDays('');
            setRestGroupsCheck([]);
            setRestDepartCheck([]);
            setRestUserCheck([]);
            setSelectedIndividButton('group');
        }
    }, [props.restScopeModalOpen]);

    useEffect(() => {
        getGroups();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [company]);

    useEffect(() => {
        setUserList(props?.originAllData);
        setDepartTableList(props?.originAllData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.originAllData]);

    const getGroups = async () => {
        await GroupService.list(company.get.id).then((response) => {
            if (response?.data) {
                const tmp = response.data.sort(function (a, b) {
                    return a.id - b.id;
                });
                setRestGroups(tmp);
            }
        });

        await CompanyService.getCommCode(company?.get?.uuid || 1000, 'EMP_TYPE').then((response) => {
            setEmployList(
                response?.data?.map((v) => {
                    return { value: v?.comm_code , label: v?.comm_code_name };
                }) || []
            );
        });

        getTreeUser();
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restGroups]);

    useEffect(() => {
        setRestDepartments(props?.restDepartments);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.restDepartments]);

    useEffect(() => {
        setSearchedDepartList((prevSearchedDepartList) => {
            return restDepartments;
        });
        setSelectedCardId(restDepartments[0]?.value);
    }, [restDepartments]);

    useEffectOnce(() => {
        if (restDepartments) {
            setSelectedCardId(restDepartments[0]?.value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCheckboxChange = (id, users) => {
        const newRestGroupsCheck = [...restGroupsCheck];

        const isChecked = newRestGroupsCheck.map((data) => data?.id).includes(id);

        if (isChecked) {
            const index = newRestGroupsCheck.findIndex((data) => data?.id === id);
            newRestGroupsCheck.splice(index, 1);
        } else {
            newRestGroupsCheck.push({ id: id, users: users });
        }

        const groupUseIds = newRestGroupsCheck.flatMap((group) => group.users);

        setRestGroupsCheck(newRestGroupsCheck);
        setGroupUsers(groupUseIds);
    };


    const toggleUserSelectAll = () => {
        const allItemIds = userList.map((item) => item.userId);
        if (restUserAllCheck) {
            setRestUserCheck([]);
        } else {
            setRestUserCheck(allItemIds);
        }
        setRestUserAllCheck(!restUserAllCheck);
    };

    useEffect(() => {
        setSearchedDepartList((prevSearchedDepartList) => {
            return departList;
        });
        setSelectedDepart(departList[0]);
    }, [departList]);

    useEffect(() => {
        setDepartUserList((prevDepartUserList) => {
            return selectedDepart?.children || [];
        });
        setSearchedDepartUserList(selectedDepart?.children || []);
        setEmployType('');
        setRestStandard('all');
        setCurrentPage(1);
    }, [selectedDepart]);

    const validate = (text) => {
        if (carryOverDays === '' && text === '이월연차 개수') {
            return t('이월연차 기준을 선택해주세요.');
        }
        if (individButton === 'group' && restGroupsCheck.length <= 0 && text === '근무그룹') {
            return t('companySetting.pleaseSelectTargetOfAnnualLeaveApplication');
        } else if (individButton === 'depart' && restDepartCheck.length <= 0 && text === '부서') {
            return t('companySetting.pleaseSelectTargetOfAnnualLeaveApplication');
        } else if (individButton === 'user' && restUserCheck.length <= 0 && text === '개인') {
            return t('companySetting.pleaseSelectTargetOfAnnualLeaveApplication');
        }

        return '';
    };

    useEffect(() => {
        let page = currentPageE;

        if (individButton === 'user') {
            let filsters = [];
            if (employType !== '' && employType !== 'all') {
                filsters.push({ key: '사원유형', value: [employType] });
            }
            if (sendSearchUser !== '') {
                filsters.push({ key: '이름', value: [sendSearchUser] });
            }
            if (restStandard !== 'all') {
                filsters.push({ key: '연차기준', value: [restStandard] });
            }

            setPreFilter(filsters);

            if(JSON.stringify(preFilter) !== JSON.stringify(filsters) && filsters.length > 0) {
                page = 1;
                            setUserRefreshPage(1)
            }else{
                        setUserRefreshPage(0)
                    }

            props?.getRefresh(moment().format('YYYY'), perPageE, page, filsters);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employType, restStandard, individButton, sendSearchUser, currentPageE, perPageE]);

    const search = (searchValue) => {
        setSendSeachUser(searchValue);
    };

    useEffect(()=>{
        const delayDebounce = setTimeout(() => {
            search(searchName);
        }, 300);

        return () => clearTimeout(delayDebounce);

    },[searchName])


    useEffect(() => {
        if (props?.totalCount > 0) {
            if(userRefreshPage == 1){
                setCurrentPageE(1)
            }else{
                setCurrentPageE(currentPageE)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.totalCount]);

    useEffect(() => {
        //applyFilter();
        setUserList(props?.originData);
        setDepartTableList(props?.originData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.originData]);

    const expandedList = (originList) => {
        let resultList = [];

        const expand = (originList) => {
            originList.forEach((origin) => {
                if (origin.type == 'depart') {
                    if (origin?.children.length ? origin?.children.filter((child) => child.type == 'depart').length < 1 : origin.userCount > 0) {
                        resultList.push(origin);
                    } else {
                        let depart = { ...origin };
                        if (depart.children || depart.userCount > 0) {
                            depart.children = origin?.children.filter((child) => child.type == 'user');
                            if (depart.children.length > 0) {
                                resultList.push(depart);
                            }
                            expand(origin.children.filter((child) => child.type == 'depart'));
                        }
                    }
                }
            });
        };
        expand(originList);

        return resultList;
    };

    const getTreeUser = async () => {
        const res = await DepartmentService.getDepartmentTreeUser(company.get.id);

        if (res?.data) {
            setDepartList(expandedList(get(res, 'data.data', [])));
        }
    };

    useEffect(() => {
        // applyFilter();
        if (individButton === 'depart') {
            let filterApplyBefore = [...departUserList];

            let standard;

            if (restStandard == '회계연도') {
                standard = true;
            } else if (restStandard == '입사일') {
                standard = false;
            }

            if (restStandard !== 'all') {
                // restType == true ? '회계연도' : '입사연도'
                filterApplyBefore = filterApplyBefore.filter((user) => (standard == true ? user.restType === true : user?.restType == '' || false));
            }

            if (employType !== '' && employType !== 'all') {
                filterApplyBefore = filterApplyBefore?.filter((user) => user?.employType?.includes(employTypeDepart));
            }

            setSearchedDepartUserList(filterApplyBefore);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employType, employTypeDepart, restStandard, individButton, perPage, currentPage]);

    // 페이지
    return(
        <>
            <Modal isOpen={props?.restScopeModalOpen} setIsOpen={props.setRestScopeModalOpen} isCentered={true} isStaticBackdrop fullScreen={'lg'} size={'xl'}>
                <ModalHeader setIsOpen={props.setRestScopeModalOpen}>
                    <ModalTitle>이월연차 기준 설정</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-sm-12 border-start border-light'>
                                <div className='row'>
                                    <div className='ps-0'>
                                        <div className='col-md-12'>
                                            <Card shadow={'none'} className='mb-0'>
                                                <CardHeader borderSize={1} className='pb-0'>
                                                    <CardTitle>{t('이월연차 개수')}</CardTitle>
                                                    <div className='text-danger'>{validate('이월연차 개수')}</div>
                                                </CardHeader>
                                                <CardBody>
                                                    <div className='row mb-2'>
                                                        <div style={{ width:'200px' }}>
                                                            <InputGroup>
                                                                <Input
                                                                    type='number'
                                                                    value={carryOverDays}
                                                                    onChange={(e) => setCarryOverDays(e.target.value)}
                                                                />
                                                                <InputGroupText>
                                                                    <span className='text-muted'>{t('workDeadline.until')}</span>
                                                                </InputGroupText>
                                                            </InputGroup>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='ps-0'>
                                        <div className='col-md-12'>
                                            {/* 개인정보 */}
                                            <Card shadow={'none'} className='mb-0'>
                                                <CardHeader borderSize={1} className='pb-0 '>
                                                    <CardTitle>{t('companySetting.selectTargetOfApplication')}</CardTitle>
                                                    {error && (
                                                        <div className='text-danger'>
                                                            {validate('근무그룹')}
                                                            {validate('부서')}
                                                            {validate('개인')}
                                                        </div>
                                                    )}
                                                </CardHeader>
                                                <CardBody>
                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        <div className='d-flex'>
                                                            <ButtonGroup
                                                                className='me-3'
                                                                style={{
                                                                    padding: 4,
                                                                    borderRadius: 8,
                                                                    backgroundColor: '#F1F1F1',
                                                                }}>
                                                                {individTabButtons.map((button) => (
                                                                    <Button
                                                                        key={button.id}
                                                                        style={{
                                                                            padding: '5px 15px 5px 15px',
                                                                            borderRadius: 8,
                                                                            backgroundColor: individButton === button.id ? 'white' : '#F1F1F1',
                                                                            color: individButton === button.id ? 'black' : '#A4A6A9',
                                                                        }}
                                                                        type='button'
                                                                        onClick={() => handleButtonClick(button.id)}>
                                                                        {t(button.label)}
                                                                    </Button>
                                                                ))}
                                                            </ButtonGroup>
                                                            {individButton === 'depart' || individButton === 'user' ? (
                                                                <div className='d-flex flex-nowrap align-items-center'>
                                                                    <Select
                                                                        style={customStyle}
                                                                        value={restStandard}
                                                                        list={[
                                                                            { value: 'all', label: t('전체') },
                                                                            { value: '회계연도', label: t('회계년도 기준') },
                                                                            { value: '입사일', label: t('입사년도 기준') },
                                                                        ]}
                                                                        onChange={async (e) => {
                                                                            setRestStandard(e.target.value);
                                                                        }}
                                                                    />
                                                                    <div className='mx-2'>
                                                                        <Select
                                                                            placeholder={t('companySetting.searchEmployeeType')}
                                                                            style={customStyle}
                                                                            value={employType}
                                                                            onChange={(e) => {
                                                                                if (individButton == 'depart') {
                                                                                    const selectedLabel = e.target.options[e.target.selectedIndex].text;
                                                                                    setEmployType(e.target.value);
                                                                                    setEmployTypeDepart(selectedLabel)

                                                                                } else if (individButton == 'user') {
                                                                                    setEmployType(e.target.value);
                                                                                }
                                                                            }}>
                                                                            {[{ value: 'all', label: t('전체') }, ...employList].map((item) => (
                                                                                <option key={item.value} value={item.value}>
                                                                                    {t(item.label)}
                                                                                </option>
                                                                            ))}
                                                                        </Select>
                                                                    </div>
                                                                    {individButton === 'user' && (
                                                                        <>
                                                                            <div>
                                                                                <Input
                                                                                    type='text'
                                                                                    className='form-control'
                                                                                    style={customStyle}
                                                                                    placeholder={t('companySetting.searchName')}
                                                                                    onChange={(e) => {
                                                                                        setSearchName(e.target.value);
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                        {individButton === 'group' ? (
                                                            <div>
                                                                <div style={{ textAlign: 'right' }}>
                                                                    {restGroupsCheck.length}{' '}
                                                                    {t('개 선택됨')}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        {individButton === 'depart' ? (
                                                            <div style={{ textAlign: 'right' }}>
                                                                {t('workingLog.peopleSelected',{
                                                                    percent:restDepartCheck?.length
                                                                })}
                                                            </div>
                                                        ) : null}
                                                        {individButton === 'user' ? (
                                                            <div style={{ textAlign: 'right' }}>
                                                                    {t('workingLog.peopleSelected',{
                                                                    percent:restUserCheck?.length
                                                                })}
                                                            </div>
                                                        ) : null}
                                                    </div>

                                                    {individButton === 'group' ? (
                                                        <>
                                                            <div className='row mt-4'>
                                                                {restGroups?.map((v) => {
                                                                    v.name = v.name === t('본사') ? t('기본') : t(v.name);
                                                                    const isOut = v.endAt && moment(v.endAt) < moment() ? true : false;
                                                                    //운영중 v.endAt && moment(v.endAt) > moment()
                                                                    return (
                                                                        <div key={`group-${v.id}`} className='col-xl-3 col-lg-6 col-md-6'>
                                                                            <Card stretch className={`${isOut ? 'bg-l25-dark' : null} custom-box-shadow rounded-2`} onChange={() => {}}>
                                                                                <CardBody className={`${isOut && 'text-white-50'} d-flex flex-column justify-content-between`}>
                                                                                    <div>
                                                                                        <CardTitle className='no-label-check' style={{ fontSize: '1.7rem', display: 'flex', alignItems: 'center' }}>
                                                                                            <span style={{ marginRight: 'auto' }}>{v?.name}</span>
                                                                                            <Checks type={'checkbox'} checked={restGroupsCheck?.map((data) => data?.id).includes(v?.id)} onChange={() => handleCheckboxChange(v?.id, v?.users)} />
                                                                                        </CardTitle>
                                                                                        <CardSubTitle className={`${isOut ? 'text-white-50' : 'text-black-50'} mt-2`}>{v?.address}</CardSubTitle>
                                                                                    </div>
                                                                                    <div className='mt-4'>
                                                                                        <p className='mb-0'>
                                                                                            <span className='fs-5 fw-bold me-1'>{v.count}</span>
                                                                                            {t('명')}
                                                                                        </p>
                                                                                    </div>
                                                                                </CardBody>
                                                                            </Card>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {individButton === 'depart' ? (
                                                        <>
                                                            <div className='d-flex row mt-4'>
                                                                <div className={'col-sm-4 p-3'}>
                                                                    <div className='position-relative me-3'>
                                                                        <InputGroup>
                                                                            <Input
                                                                                type='text'
                                                                                value={departSearchText}
                                                                                placeholder={t('companyAuthor.searchDepartment')}
                                                                                onChange={(e) => setDepartSearchText(e.target.value)}
                                                                            />
                                                                            {departSearchText && departSearchText.length > 0 ? (
                                                                                <Button
                                                                                    type='button'
                                                                                    icon='Cancel'
                                                                                    className='position-absolute'
                                                                                    style={{
                                                                                        right: '34px',
                                                                                        zIndex: '10',
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        setDepartSearchText('');
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <></>
                                                                            )}
                                                                            <Button
                                                                                type='button'
                                                                                icon='Search'
                                                                                style={{
                                                                                    border: '1px solid #e7eef8',
                                                                                }}
                                                                                onClick={() => {
                                                                                    setSearchedDepartList(departList.filter((tree) => tree.name.includes(departSearchText)));
                                                                                }}></Button>
                                                                        </InputGroup>
                                                                    </div>
                                                                    <div style={{ overflow: 'auto' }} className='px-1 mt-4'>
                                                                        {searchedDepartList.length > 0 ? (
                                                                            searchedDepartList.map((v, i) => {
                                                                                return (
                                                                                    <div key={i} onClick={() => {}}>
                                                                                        <Card
                                                                                            key={i}
                                                                                            stretch
                                                                                            borderSize='2'
                                                                                            borderColor={selectedDepart?.name === v.name ? 'info' : 'light'}
                                                                                            style={{
                                                                                                borderRadius: '10px',
                                                                                                boxShadow: '0px 5px 5px 3px #e9e9ea',
                                                                                                cursor: 'pointer',
                                                                                            }}
                                                                                            className='mb-3'
                                                                                            onClick={() => {
                                                                                                setSelectedDepart(v);
                                                                                                setSelectAll(false);
                                                                                            }}>
                                                                                            <CardBody className='py-4'>
                                                                                                <CardTitle style={{ fontSize: '1.7rem', display: 'flex', alignItems: 'center' }}>
                                                                                                    <span style={{ marginRight: 'auto' }}>{v.name}</span>
                                                                                                </CardTitle>
                                                                                                <CardSubTitle className='mt-3'>
                                                                                                    <span className='fs-5 text-muted fw-bold me-1'>{v?.children?.length}</span>
                                                                                                    {t('명')}
                                                                                                </CardSubTitle>
                                                                                            </CardBody>
                                                                                        </Card>
                                                                                    </div>
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <tr>
                                                                                <td className='text-center py-5' colSpan='4'>
                                                                                    {t('companySetting.notFoundDeparment')}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className={'col-sm-8'}>
                                                                    <div style={{ overflowY: 'auto' }}></div>
                                                                    <div className='table-responsive'>
                                                                        <table className='table table-modern'>
                                                                            <thead>
                                                                            <tr>
                                                                                <th width='10%' height='50px'>
                                                                                    <Checks
                                                                                        type='checkbox'
                                                                                        onChange={() => {
                                                                                            setSearchedDepartUserList((prevSearchedDepartUserList) => {
                                                                                                let updatedSearchedDepartUserList = [...prevSearchedDepartUserList];
                                                                                                updatedSearchedDepartUserList = updatedSearchedDepartUserList.map((user) => ({
                                                                                                    ...user,
                                                                                                    chk: !selectAll,
                                                                                                }));
                                                                                                return updatedSearchedDepartUserList;
                                                                                            });
                                                                                            setSelectAll((prevSelectAll) => !prevSelectAll);
                                                                                            setRestDepartCheck(selectAll ? [] : onCurrentPageData.map(data => data.userId));
                                                                                        }}
                                                                                        checked={selectAll}
                                                                                    />
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('이름')}
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('부서')}
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('직급')}
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('입사일')}
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('사원유형')}
                                                                                </th>
                                                                                <th width='16%' className='text-center'>
                                                                                    {t('기준')}
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {onCurrentPageData.length > 0 ? (
                                                                                onCurrentPageData.map((v, i) => {
                                                                                    return (
                                                                                        <tr key={i}>
                                                                                            <td>
                                                                                                <Checks
                                                                                                    type='checkbox'
                                                                                                    onChange={(e) => {
                                                                                                        setSearchedDepartUserList((prevSearchedDepartUserList) => {
                                                                                                            let updatedSearchedDepartUserList = [...prevSearchedDepartUserList];
                                                                                                            updatedSearchedDepartUserList[i] = {
                                                                                                                ...updatedSearchedDepartUserList[i],
                                                                                                                chk: e.target.checked,
                                                                                                            };
                                                                                                            return updatedSearchedDepartUserList;
                                                                                                        });
                                                                                                        setRestDepartCheck(prevUserIds => {
                                                                                                            if (e.target.checked == true) {
                                                                                                                return [...prevUserIds, v.userId];
                                                                                                            } else {
                                                                                                                return prevUserIds.filter(id => id !== v.userId);
                                                                                                            }
                                                                                                        });
                                                                                                    }}
                                                                                                    checked={selectedUserList.map((data) => data.userId).includes(v.userId) || v?.chk}
                                                                                                />
                                                                                            </td>
                                                                                            <td className='text-center'>{v.name}</td>
                                                                                            <td className='text-center'>{v.department}</td>
                                                                                            <td className='text-center'>{t(v.rank)}</td>
                                                                                            <td className='text-center'>{moment(v.joinDate).format('YYYY-MM-DD')}</td>
                                                                                            <td className='text-center'>{v.employTypeNm || '-'}</td>
                                                                                            <td className='text-center'>{v.restType !== null ? (v.restType == true ?  t('companySetting.fiscalYear') : t('companySetting.yearOfEmplyment')) : company.get.restType !== null ? company.get.restType !== true ? t('companySetting.yearOfEmplyment')  : t('companySetting.fiscalYear') : '-'}</td>
                                                                                        </tr>
                                                                                    );
                                                                                })
                                                                            ) : (
                                                                                <tr>
                                                                                    <td className='text-center py-5' colSpan='4'>
                                                                                        {t('companySetting.noMorePerson')}
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <PaginationButtons
                                                                        data={searchedDepartUserList}
                                                                        label='items'
                                                                        setCurrentPage={setCurrentPage}
                                                                        currentPage={currentPage}
                                                                        perPage={perPage}
                                                                        setPerPage={setPerPage}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        ''
                                                    )}

                                                    {individButton === 'user' ? (
                                                        <>
                                                            <div className='table-responsive mt-4'>
                                                                <table className='table table-modern'>
                                                                    <thead>
                                                                        <tr>
                                                                            {restHistoryColumnData2.map((index, i) => (
                                                                                <th
                                                                                    style={{
                                                                                        whiteSpace: 'nowrap',
                                                                                        textAlign: 'center',
                                                                                    }}
                                                                                    key={i}
                                                                                    className='bg-white cursor-pointer'>
                                                                                    {index.name !== 'check' ? t(index.name) : <Checks type={'checkbox'} checked={restUserAllCheck} onChange={toggleUserSelectAll} />}{' '}
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {props.originData &&
                                                                            props.originData?.length > 0 &&
                                                                            props.originData.map((item, i) => {

                                                                                return (
                                                                                    <tr key={i} className={item.state === 'REJECT' ? 'fw-lighter' : ''}>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 80,
                                                                                                textAlign: 'center',
                                                                                            }}>
                                                                                            <Checks
                                                                                                checked={restUserCheck.includes(item?.userId)}
                                                                                                onChange={() => {
                                                                                                    const updatedSelectedItems = restUserCheck.includes(item.userId)
                                                                                                        ? restUserCheck.filter((id) => id !== item.userId)
                                                                                                        : [...restUserCheck, item.userId];
                                                                                                    setRestUserCheck(updatedSelectedItems);

                                                                                                    setRestUserAllCheck(updatedSelectedItems?.length === userList?.length);
                                                                                                }}
                                                                                            />
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 100,
                                                                                                textAlign: 'center',
                                                                                            }}>
                                                                                            {t(item.user.name)}
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 100,
                                                                                                textAlign: 'center',
                                                                                            }}>
                                                                                            {item.departments?.length > 0 ? t(item?.departments[0]?.department?.name) : t(item?.departments?.department?.name)}
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 70,
                                                                                                textAlign: 'center',
                                                                                            }}>
                                                                                            {t(item.rank?.name || '-')}
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 100,
                                                                                                textAlign: 'center',
                                                                                            }}>
                                                                                            {t(item.restInfo?.joinDate)}
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 100,
                                                                                                textAlign: 'center',
                                                                                                color: '#556EE6',
                                                                                            }}>
                                                                                            {item?.employTypeNm || '-'}
                                                                                        </td>
                                                                                        <td
                                                                                            style={{
                                                                                                minWidth: 100,
                                                                                                textAlign: 'center',
                                                                                                color: '#556EE6',
                                                                                            }}>
                                                                                            {item?.restType !== null ? (item?.restType == true ? t('companySetting.fiscalYear')  : t('companySetting.yearOfEmplyment') ) : company.get.restType !== null ? company.get.restType !== true ? t('companySetting.yearOfEmplyment') : t('companySetting.fiscalYear') : '-'}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        {userList.length === 0 && (
                                                                            <tr>
                                                                                <td className='text-center py-5' colSpan={restHistoryColumnData.length}>
                                                                                    {t('companySetting.noMorePerson')}
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <PaginationButtons2
                                                                data={props.originData}
                                                                allDataLength={props?.totalCount}
                                                                label='userList'
                                                                setCurrentPage={setCurrentPageE}
                                                                currentPage={currentPageE}
                                                                perPage={perPageE}
                                                                setPerPage={setPerPageE}
                                                            />
                                                        </>
                                                    ) : (
                                                        ''
                                                    )}
                                                </CardBody>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={() => {
                            props.setRestScopeModalOpen(false);
                        }}>
                        {t('취소')}
                    </Button>
                    <Button
                        onClick={() => {
                            setError(true);
                            const allFalse = Object.values(userWorkType).every((value) => value === false);
                            if (carryOverDays >= 0) {
                                if (individButton === 'group' && restGroupsCheck.length > 0) {
                                    setConfirmModal(true);
                                } else if (individButton === 'depart' && restDepartCheck.length > 0) {
                                    setConfirmModal(true);
                                } else if (individButton === 'user' && restUserCheck.length > 0) {
                                    setConfirmModal(true);
                                } else if (individButton === 'usergroup' && !allFalse) {
                                    setConfirmModal(true);
                                }
                            }
                        }}>
                        {t('적용')}
                    </Button>
                </ModalFooter>
            </Modal>

            {/* 적용 모달 */}
            {confirmModal === true && (
                <Modal setIsOpen={setConfirmModal} isOpen={confirmModal} size={'sm'} isCentered>
                    <ModalBody className='border py-5 d-flex justify-content-center my-3'>
                        <div className='justify-content-center'>
                            <div className='fs-5 mb-3 d-flex justify-content-center '>{t('companySetting.confirmSelectedNumber')}</div>
                            <div className='mb-3 d-flex justify-content-center'>{t('companySetting.cantUndo')}</div>
                        </div>
                    </ModalBody>
                    <ModalFooter className='d-flex justify-content-center my-3'>
                        <Button
                            color={'light'}
                            onClick={() => {
                                setConfirmModal(false);
                            }}>
                            {t('취소')}
                        </Button>
                        <Button
                            color={'info'}
                            onClick={async () => {
                                // annualBasic // fiscalYear = 회계년도 true,  employmentYear==입사년도 false
                                // userWorkType 사용자유형별  일반직, 기능직, 정규직, 계약직 true false 로 구분
                                var sendData = {
                                    users: individButton === 'group' ? groupUsers : individButton === 'depart' ? restDepartCheck : individButton === 'user' ? restUserCheck : '',
                                    companyId: company.get.id,
                                    restType: annualBasic === 'employmentYear' ? false : true,
                                    restDate: annualBasic === 'fiscalYear' ? restDate : null,
                                    restOptionYear: annualBasic === 'fiscalYear' ? restOptionYear == null ? company.get.restOptionYear : restOptionYear : null,
                                    restRoundYear: annualBasic === 'fiscalYear' ? restRoundYear : 'ROUND',
                                };

                                try {
                                    await CompanyService.setRestOption(sendData);
                                    setConfirmModal(false);
                                    props.setRestScopeModalOpen(false);
                                    props.getRefresh();
                                    showNotification(t('companySetting.message.anunalLeaveSetting'), t('companySetting.message.anunalLeaveSettingSaved') , 'info');
                                } catch (error) {
                                    console.error('Error:', error);
                                    showNotification(t('companySetting.message.anunalLeaveSetting'), t('companySetting.message.error'), 'danger');
                                }
                            }}>
                            {t('companySetting.applyChange')}
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    )
};

export default RestSettingModal;