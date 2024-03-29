import React, {Fragment} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import OrderCard from "../partial/OrderCard";
import {
    removeIntegrationWithPp,
    removeNotificationChannel,
    removeOption,
    setIntegrationWithPp,
    setNotificationChannel,
    setOption
} from "../../../store/order/actions";
import Row from "reactstrap/es/Row";
import {hasProps} from "../../../util/object";
import {
    OPTION_GROUP_INTEGRATIONS,
    OPTION_INTEGRATIONS_COLLECT_LEADS,
    OPTION_INTEGRATIONS_SEND_LEADS_TO_PP
} from "../constants";

class OrderThirdStep extends React.Component {
    constructor(props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handlePartnerChange = this.handlePartnerChange.bind(this);
        this.isOptionSelected = this.isOptionSelected.bind(this);
    }
    handleOptionChange(state, keyword) {
        if (state) {
            this.props.setOption(keyword, "");
        } else {
            this.props.removeOption(keyword);
        }
    }
    handleChannelChange(state, keyword) {
        if (state) {
            this.props.setNotificationChannel(keyword, "");
        } else {
            this.props.removeNotificationChannel(keyword);
        }
    }
    handlePartnerChange(state, keyword) {
        if (state) {
            this.props.setIntegrationWithPp(keyword, "");
        } else {
            this.props.removeIntegrationWithPp(keyword);
        }
    }
    isOptionSelected(keyword) {
        return this.props.selectedOptions.hasOwnProperty(keyword);
    }
    isChannelSelected(keyword) {
        return this.props.selectedChannels.hasOwnProperty(keyword);
    }
    isPartnerSelected(keyword) {
        return this.props.selectedPartners.hasOwnProperty(keyword);
    }
    render() {
        return (
            <Row>
                <Fragment>
                    {this.props.options.map((option, i) => {
                        if (option.group !== OPTION_GROUP_INTEGRATIONS) {
                            return (" ");
                        }
                        let selectedValues = {};
                        if (option.keyword === OPTION_INTEGRATIONS_COLLECT_LEADS) {
                            selectedValues = this.props.selectedChannels;
                        } else if (option.keyword === OPTION_INTEGRATIONS_SEND_LEADS_TO_PP) {
                            selectedValues = this.props.selectedPartners;
                        }
                        return (
                            <OrderCard key={i} type="checkbox"
                                       name="option" title={option.name} description={option.description}
                                       colNonActive={12} colActive={12}
                                       priceMin={option.priceMin} priceMax={option.priceMax}
                                       active={this.isOptionSelected(option.keyword)}
                                       value={option.keyword}
                                       error={!hasProps(selectedValues)}
                                       onChange={this.handleOptionChange}>
                                {(function () {
                                    switch (option.keyword) {
                                        case OPTION_INTEGRATIONS_COLLECT_LEADS:
                                            return (
                                                <Fragment>
                                                    <Row>
                                                        {this.props.channels.map((channel, j) => {
                                                            return (
                                                                <OrderCard key={"channel-" + i + "-" + j}
                                                                           type="checkbox"
                                                                           name="channel" title={channel.name}
                                                                           colNonActive={4} colActive={4}
                                                                           withoutPrice
                                                                           titleHelp="
                                                                               Настройку уведомлений можно будет
                                                                               сделать позже в личном кабинете"
                                                                           active={this.isChannelSelected(channel.keyword)}
                                                                           value={channel.keyword}
                                                                           onChange={this.handleChannelChange}/>
                                                            )
                                                        })}
                                                    </Row>
                                                </Fragment>
                                            );
                                        case OPTION_INTEGRATIONS_SEND_LEADS_TO_PP:
                                            return (
                                                <Fragment>
                                                    <Row>
                                                        {this.props.partners.map((partner, j) => {
                                                            return (
                                                                <OrderCard key={"partner-" + i + "-" + j}
                                                                           type="checkbox"
                                                                           name="partner" title={partner.name}
                                                                           colNonActive={3} colActive={3}
                                                                           withoutPrice
                                                                           titleHelp="
                                                                               Настройку уведомлений можно будет
                                                                               сделать позже в личном кабинете"
                                                                           active={this.isPartnerSelected(partner.keyword)}
                                                                           value={partner.keyword}
                                                                           onChange={this.handlePartnerChange}/>
                                                            )
                                                        })}
                                                    </Row>
                                                </Fragment>
                                            );
                                        default:
                                            return null;
                                    }
                                }.bind(this))()}
                            </OrderCard>
                        )
                    })}
                </Fragment>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        options: state.order.options,
        selectedOptions: state.order.selectedOptions,
        channels: state.order.channels,
        selectedChannels: state.order.selectedChannels,
        partners: state.order.partners,
        selectedPartners: state.order.selectedPartners,
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    setOption,
    removeOption,
    setNotificationChannel,
    removeNotificationChannel,
    setIntegrationWithPp,
    removeIntegrationWithPp,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OrderThirdStep);
