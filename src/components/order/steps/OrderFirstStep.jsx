import React, {Fragment} from 'react';
import {Button, FormGroup, FormText, Input, Row, Spinner} from "reactstrap";
import OrderCard from "../partial/OrderCard";
import {Link} from "react-router-dom";
import {FaHandPointer} from "react-icons/fa";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchLanding} from "../../../api/landing";
import {deselectLanding, setArchiveAttached, setSource, setSourceUrl} from "../../../store/order/actions";
import {getOptionDescription} from "../functions";
import {validateUrl} from "../../../util/string";
import {OPTION_SOURCE_FROM_ARCHIVE, OPTION_SOURCE_FROM_SHOP, OPTION_SOURCE_FROM_URL} from "../constants";

class OrderFirstStep extends React.Component {
    constructor(props) {
        super(props);
        this.handleSourceUrlKeyUp = this.handleKeyUp.bind(this, OPTION_SOURCE_FROM_URL);
        this.updateSource = this.updateSource.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.fetchLandingInfo = this.fetchLandingInfo.bind(this);
    }
    componentWillMount() {
        this.fetchLandingInfo();
    }
    fetchLandingInfo() {
        let landingId = this.props.urlParameterLandingId;
        if (landingId) {
            if (this.props.landingId !== null && landingId !== this.props.landingId) {
                this.props.deselectLanding();
            }
            if (!this.props.landingId || landingId !== this.props.landingId || this.props.landing === null) {
                this.props.fetchLanding(landingId);
                this.props.setSource(OPTION_SOURCE_FROM_SHOP);
            }
        } else if (this.props.landingId !== null) {
            this.props.setSource(OPTION_SOURCE_FROM_SHOP);
        } else {
            this.props.setSource(OPTION_SOURCE_FROM_URL);
        }
    }
    handleChange(files) {
        this.props.setArchiveAttached(files.length > 0);
    }
    handleKeyUp(type, event) {
        if (type === OPTION_SOURCE_FROM_URL) {
            this.props.setSourceUrl(event.target.value);
        }
    }
    updateSource(state, value) {
        if (state) {
            this.props.setSource(value);
        }
    }
    render() {
        return (
            <Row>
                <OrderCard type="radio"
                           name="source" title="Ввести URL"
                           description={getOptionDescription(this.props.options, OPTION_SOURCE_FROM_URL)}
                           colNonActive={3} colActive={6}
                           priceMin={300} priceMax={300}
                           active={this.props.source === OPTION_SOURCE_FROM_URL} value={OPTION_SOURCE_FROM_URL}
                           error={!validateUrl(this.props.sourceUrl)}
                           onChange={this.updateSource}>
                    <FormGroup>
                        <Input type="text" name="source" placeholder="Например: https://superlanding.com"
                               onKeyUp={this.handleSourceUrlKeyUp}/>
                    </FormGroup>
                </OrderCard>
                <OrderCard type="radio"
                           name="source" title="Выбрать из магазина"
                           description={getOptionDescription(this.props.options, OPTION_SOURCE_FROM_SHOP)}
                           colNonActive={3} colActive={6}
                           priceMin={100} priceMax={100}
                           active={this.props.source === OPTION_SOURCE_FROM_SHOP} value={OPTION_SOURCE_FROM_SHOP}
                           error={this.props.landing === null}
                           onChange={this.updateSource}>
                    {this.props.isLandingLoading ? (
                        <div>
                            Загрузка данных <Spinner size="sm" color="secondary"/>
                        </div>
                    ) : (
                        <Fragment>
                            {this.props.landing !== null && (
                                <Fragment>
                                    Выбран лендинг №{this.props.landing.id} - {this.props.landing.name}<br/>
                                </Fragment>
                            )}
                            <Link to="/shop">
                                <Button color="primary" size={this.props.landing !== null ? "sm" : ""}
                                        className="mt-2">
                                    <FaHandPointer className="mr-1"/>
                                    Перейти к выбору{this.props.landing !== null ? " другого лендинга" : ""} в
                                    магазине
                                </Button>
                            </Link>
                        </Fragment>
                    )}
                </OrderCard>
                <OrderCard type="radio"
                           name="source" title="Прикрепить архив"
                           description={getOptionDescription(this.props.options, OPTION_SOURCE_FROM_ARCHIVE)}
                           colNonActive={3} colActive={6}
                           priceMin={0} priceMax={0}
                           active={this.props.source === OPTION_SOURCE_FROM_ARCHIVE} value={OPTION_SOURCE_FROM_ARCHIVE}
                           error={!this.props.isArchiveAttached}
                           onChange={this.updateSource}>
                    <FormGroup>
                        <Input type="file" name="file" accept=".zip,.rar,.7zip,.tar"
                               onChange={(e) => this.handleChange(e.target.files)}/>
                        <FormText color="muted">
                            Принимаются форматы: <b>zip</b>, <b>rar</b>, <b>7zip</b> и <b>tar</b>.
                        </FormText>
                    </FormGroup>
                </OrderCard>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        source: state.order.source,
        sourceUrl: state.order.sourceUrl,
        landingId: state.order.landingId,
        landing: state.order.landing,
        isLandingLoading: state.order.isLandingLoading,
        isArchiveAttached: state.order.isArchiveAttached,
        options: state.order.options,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    setSource,
    setSourceUrl,
    fetchLanding,
    deselectLanding,
    setArchiveAttached,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderFirstStep);
