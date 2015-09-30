// Copyright 2014 The Gogs Authors. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

package repo

import (
	"fmt"
	"io/ioutil"
	"path/filepath"

	"github.com/gogits/gogs/modules/middleware"
	"github.com/gogits/gogs/modules/process"
)

func SaveStuff(ctx *middleware.Context) {
	if ctx.Repo.Owner.Name != ctx.User.Name {
		fmt.Println("not yo repo")
		ctx.JSON(200, "NOT OK")
	} else {
		fmt.Println("you got it")

		content := ctx.Query("content")

		err := ioutil.WriteFile(filepath.Join(ctx.Repo.GitRepo.Path + "/", "README.md"),
			[]byte(content), 0644);

		_, _, _ = process.ExecDir(-1,
			filepath.Join(ctx.Repo.GitRepo.Path), fmt.Sprintf("git add: %s", filepath.Join(ctx.Repo.GitRepo.Path)),
			"git", "add", "*.md")

		sig := ctx.User.NewGitSig()

		if _, stderr, err2 := process.ExecDir(-1,
			filepath.Join(ctx.Repo.GitRepo.Path), fmt.Sprintf("git commit: %s", filepath.Join(ctx.Repo.GitRepo.Path)),
			"git", "commit", fmt.Sprintf("--author='%s <%s>'", sig.Name, sig.Email),
			"-m", "save"); err2 != nil {
			ctx.JSON(200, "NOT COMMIT")
			fmt.Println("git commit: %s", err2)
			fmt.Println("git commit: %s", stderr)
		} else {
		  if err != nil {
		  	ctx.JSON(200, "OK")
			} else {
				ctx.JSON(200, "NOT OK")
			}
		}
	}
}
