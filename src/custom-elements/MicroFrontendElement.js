import { createMuiTheme } from '@material-ui/core';
import { itIT } from '@material-ui/core/locale';

import { jssPreset, StylesProvider, ThemeProvider } from '@material-ui/core/styles';

import KeycloakContext from 'auth/KeycloakContext';
import { KEYCLOAK_EVENT_TYPE } from 'custom-elements/widgetEventTypes';
import { subscribeToWidgetEvent } from 'helpers/widgetEvents';
import setLocale from 'i18n/setLocale';
import { create as jssCreate } from 'jss';
import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import AuthenticatedView from '../auth/KeycloakViews';
import App from '../components/App';
import MicroFrontendProvider from '../context/MicroFrontendProvider';

const getKeycloakInstance = () =>
  (window &&
    window.entando &&
    window.entando.keycloak && { ...window.entando.keycloak, initialized: true }) || {
    initialized: false,
  };

const ATTRIBUTES = {
  hidden: 'hidden',
  locale: 'locale',
  disableDefaultEventHandler: 'disable-default-event-handler', // custom element attribute names MUST be written in kebab-case
  useMock: 'use-mock',
};

class MicroFrontendElement extends HTMLElement {
  jss;

  container;

  mountPoint;

  keycloak = getKeycloakInstance();

  unsubscribeFromKeycloakEvent;

  defaultEventHandlerDisabled;

  muiTheme;

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.container || oldValue === newValue) {
      return;
    }
    if (!Object.values(ATTRIBUTES).includes(name)) {
      throw new Error(`Untracked changed attribute: ${name}`);
    }
    if (name === ATTRIBUTES.disableDefaultEventHandler) {
      this.onToggleDisableDefaultEvent();
    }
    this.render();
  }

  connectedCallback() {
    this.container = document.createElement('div');
    this.mountPoint = document.createElement('div');
    this.container.appendChild(this.mountPoint);

    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.container);

    this.jss = jssCreate({
      ...jssPreset(),
      insertionPoint: this.container,
    });

    this.muiTheme = createMuiTheme(
      {
        props: {
          MuiDialog: {
            container: this.mountPoint,
          },
          MuiPopover: {
            container: this.mountPoint,
          },
        },
      },
      itIT
    );

    this.keycloak = { ...getKeycloakInstance(), initialized: true };

    this.unsubscribeFromKeycloakEvent = subscribeToWidgetEvent(KEYCLOAK_EVENT_TYPE, () => {
      this.keycloak = { ...getKeycloakInstance(), initialized: true };
      this.render();
    });

    this.onToggleDisableDefaultEvent();

    this.render();

    retargetEvents(shadowRoot);
  }

  disconnectedCallback() {
    if (this.unsubscribeFromKeycloakEvent) {
      this.unsubscribeFromKeycloakEvent();
    }
  }

  onToggleDisableDefaultEvent() {
    const disableEventHandler = this.getAttribute(ATTRIBUTES.disableDefaultEventHandler) === 'true';

    if (disableEventHandler !== this.defaultEventHandlerDisabled) {
      // eslint-disable-next-line no-empty
      if (!disableEventHandler) {
      } else {
        if (this.unsubscribeFromWidgetEvents) {
          this.unsubscribeFromWidgetEvents();
        }
        if (this.unsubscribeFromKeycloakEvent) {
          this.unsubscribeFromKeycloakEvent();
        }
      }
      this.defaultEventHandlerDisabled = disableEventHandler;
    }
  }

  render() {
    const hidden = this.getAttribute(ATTRIBUTES.hidden) === 'true';
    const useMock = this.getAttribute(ATTRIBUTES.useMock) === 'true';
    if (hidden) {
      ReactDOM.render(<></>);
      return;
    }
    const locale = this.getAttribute(ATTRIBUTES.locale) || 'it';
    setLocale(locale);
    ReactDOM.render(
      <KeycloakContext.Provider value={this.keycloak}>
        <StylesProvider jss={this.jss}>
          <ThemeProvider theme={this.muiTheme}>
            <AuthenticatedView keycloak={this.keycloak}>
              <MicroFrontendProvider keycloak={this.keycloak} useMock={useMock}>
                <App />
              </MicroFrontendProvider>
            </AuthenticatedView>
          </ThemeProvider>
        </StylesProvider>
      </KeycloakContext.Provider>,
      this.mountPoint
    );
  }
}

customElements.define('micro-fronted', MicroFrontendElement);
