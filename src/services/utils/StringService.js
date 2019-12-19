import React from "react";

export default class StringService {
  /**
   * Capitalize a string. It means that the first letter is uppercase and the rest is lowercase.
   * @param   {number} string The string to capitalize.
   * @returns {string}        The capitalized string.
   */
  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static compareCaseInsensitive(s1, s2) {
    s1 = s1 || "";
    s2 = s2 || "";
    const nameA = s1.toUpperCase();
    const nameB = s2.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  static nl2br(str) {
    return str.split("\n").map((item, key) => (
      <span key={key}>
        {item}
        <br />
      </span>
    ));
  }
}
