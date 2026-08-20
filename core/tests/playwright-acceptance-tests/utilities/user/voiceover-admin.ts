// Copyright 2026 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utility functions for voiceover admin page.
 */

import {Page} from '@playwright/test';
import {BaseUser} from '../common/playwright-utils';
import testConstants from '../common/test-constants';
import {ExplorationEditor} from './exploration-editor';

const baseURL = testConstants.URLs.BaseURL;
const voiceoverAdminURL = testConstants.URLs.VoiceoverAdmin;

const languageAccentOptionSelector =
  '.e2e-test-language-accent-selector-option';
const addNewLanguageAccentButtonSelector =
  '.e2e-test-add-new-language-accent-button';
const languageAccentDropdownSelector =
  '.e2e-test-language-accent-dropdown-selector';
const editVoiceoverArtistButton = 'span.e2e-test-edit-voice-artist-roles';
const voiceArtistUsernameInputBox = 'input#newVoicAartistUsername';
const saveVoiceoverArtistEditButton =
  'button.e2e-test-add-voice-artist-role-button';

export class VoiceoverAdmin extends BaseUser {
  /**
   * Function to register supported language and accent combinations for Oppia voiceovers.
   * @param {string} languageAccentDescription - The language-accent to add.
   */
  async addSupportedLanguageAccentPair(
    languageAccentDescription: string
  ): Promise<void> {
    await this.navigateToVoiceoverAdminPage();
    await this.waitForPageToFullyLoad();

    await this.expectElementToBeVisible(addNewLanguageAccentButtonSelector);
    await this.clickOnElementWithSelector(addNewLanguageAccentButtonSelector);

    await this.expectElementToBeVisible(languageAccentDropdownSelector);
    await this.clickOnElementWithSelector(languageAccentDropdownSelector);

    await this.clickOnElementWithSelectorAndText(
      languageAccentOptionSelector,
      languageAccentDescription
    );
    await this.expectElementToBeVisible(addNewLanguageAccentButtonSelector);
  }

  /**
   * Navigate to the voiceover admin page.
   */
  async navigateToVoiceoverAdminPage(): Promise<void> {
    await this.goto(voiceoverAdminURL);
  }

  /**
   * Adds a user as a voiceover artist for an exploration.
   * @param {string} explorationId - The ID of the exploration.
   * @param {string} voiceArtistUsername - The username to grant access to.
   */
  async addVoiceoverArtistToExplorationWithID(
    explorationId: string,
    voiceArtistUsername: string
  ): Promise<void> {
    await this.goto(`${baseURL}/create/${explorationId}`);

    const explorationEditor = new ExplorationEditor(this.page);
    await explorationEditor.dismissWelcomeModal(false);
    await explorationEditor.navigateToSettingsTab();

    await this.expectElementToBeVisible(editVoiceoverArtistButton);
    await this.clickOnElementWithSelector(editVoiceoverArtistButton);
    await this.expectElementToBeVisible(voiceArtistUsernameInputBox);
    await this.typeInInputField(
      voiceArtistUsernameInputBox,
      voiceArtistUsername
    );
    await this.clickOnElementWithSelector(saveVoiceoverArtistEditButton);
    await this.expectElementToBeVisible(
      `div.e2e-test-voice-artist-${voiceArtistUsername}`
    );
  }
}

export let VoiceoverAdminFactory = (page: Page): VoiceoverAdmin => {
  return new VoiceoverAdmin(page);
};
